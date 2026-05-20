<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Stripe\StripeClient;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeController extends Controller
{
    private function stripe(): StripeClient
    {
        return new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Step 1: Validate shipping details, create a pending order, return a PaymentIntent client_secret.
     */
    public function createIntent(Request $request)
    {
        $data = $request->validate([
            'customer_name'    => 'required|string|max:100',
            'customer_email'   => 'required|email|max:150',
            'customer_phone'   => 'nullable|string|max:30',
            'shipping_address' => 'required|string|max:500',
            'customer_notes'   => 'nullable|string|max:1000',
        ]);

        $sessionId = Session::getId();
        $userId    = auth()->id();

        $cart = Cart::with('items.product')
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['error' => 'Your cart is empty.'], 422);
        }

        $subtotal = $cart->items->sum(fn($i) => $i->unit_price * $i->quantity);
        $shipping = 15.00;
        $total    = $subtotal + $shipping;

        $order = DB::transaction(function () use ($data, $cart, $subtotal, $shipping, $total, $userId) {
            // Delete any previous pending_payment order for this cart
            $order = Order::create(array_merge($data, [
                'user_id'        => $userId,
                'subtotal'       => $subtotal,
                'shipping'       => $shipping,
                'total'          => $total,
                'status'         => 'pending_payment',
                'payment_status' => 'unpaid',
                'currency'       => 'AUD',
            ]));

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product?->name ?? 'Custom Design',
                    'quantity'     => $item->quantity,
                    'unit_price'   => $item->unit_price,
                    'neon_color'   => $item->neon_color,
                    'size'         => $item->size,
                    'background'   => $item->background,
                    'custom_text'  => $item->custom_text,
                    'font'         => $item->font,
                    'design_data'  => $item->design_data,
                ]);
            }

            return $order;
        });

        // Create Stripe PaymentIntent outside the DB transaction (keep transaction short)
        try {
            $intent = $this->stripe()->paymentIntents->create([
                'amount'        => (int) round($total * 100),
                'currency'      => 'aud',
                'description'   => 'Custom Neon Signs Australia — Order #' . $order->order_number,
                'receipt_email' => $data['customer_email'],
                'metadata'      => [
                    'order_id'     => $order->id,
                    'order_number' => $order->order_number,
                ],
                'automatic_payment_methods' => ['enabled' => true],
            ]);
        } catch (\Stripe\Exception\ApiConnectionException $e) {
            // Network issue reaching Stripe
            $order->delete();
            Log::error('Stripe connection failed for order ' . $order->order_number . ': ' . $e->getMessage());
            return response()->json(['error' => 'Payment service is temporarily unavailable. Please try again in a moment.'], 503);
        } catch (\Stripe\Exception\AuthenticationException $e) {
            $order->delete();
            Log::error('Stripe authentication error: ' . $e->getMessage());
            return response()->json(['error' => 'Payment configuration error. Please contact support.'], 500);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            $order->delete();
            Log::error('Stripe API error for order ' . $order->order_number . ': ' . $e->getMessage());
            return response()->json(['error' => 'Unable to create payment session. Please try again.'], 500);
        } catch (\Exception $e) {
            $order->delete();
            Log::error('Unexpected Stripe error: ' . $e->getMessage());
            return response()->json(['error' => 'An unexpected error occurred. Please try again.'], 500);
        }

        $order->update(['payment_intent_id' => $intent->id]);

        return response()->json([
            'client_secret' => $intent->client_secret,
            'order_number'  => $order->order_number,
            'order_id'      => $order->id,
            'total'         => $total,
        ]);
    }

    /**
     * Sync payment status by querying Stripe directly.
     * Called from the frontend after confirmPayment() succeeds.
     * Handles the case where the webhook hasn't fired yet (e.g. local dev).
     */
    public function syncPayment(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        // Already paid — nothing to do
        if ($order->payment_status === 'paid') {
            return response()->json(['status' => 'paid']);
        }

        if (!$order->payment_intent_id) {
            return response()->json(['error' => 'No payment intent on record.'], 422);
        }

        try {
            $intent = $this->stripe()->paymentIntents->retrieve($order->payment_intent_id);
        } catch (\Exception $e) {
            Log::error('syncPayment: Stripe retrieve failed — ' . $e->getMessage());
            return response()->json(['error' => 'Could not verify payment.'], 500);
        }

        if ($intent->status === 'succeeded') {
            $order->update([
                'status'              => 'processing',
                'payment_status'      => 'paid',
                'payment_method_type' => $intent->payment_method_types[0] ?? 'card',
                'paid_at'             => now(),
            ]);

            // Clear the customer's cart
            $cart = \App\Models\Cart::where(function ($q) use ($order) {
                $q->where('user_id', $order->user_id)
                  ->orWhere('session_id', Session::getId());
            })->first();
            if ($cart) {
                $cart->items()->delete();
                $cart->delete();
            }

            $order->notes()->create([
                'content' => 'Payment confirmed (sync). Stripe Payment Intent: ' . $intent->id,
                'type'    => 'system',
            ]);

            return response()->json(['status' => 'paid']);
        }

        // Payment not yet succeeded (processing, requires_action, etc.)
        return response()->json(['status' => $intent->status]);
    }

    /**
     * Stripe webhook — update order status on payment confirmation.
     */
    public function webhook(Request $request)
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        if ($secret) {
            try {
                $event = Webhook::constructEvent($payload, $sigHeader, $secret);
            } catch (SignatureVerificationException $e) {
                return response('Invalid signature', 400);
            }
        } else {
            $event = json_decode($payload, true);
            $event = (object) ['type' => $event['type'] ?? '', 'data' => (object) ['object' => (object) ($event['data']['object'] ?? [])]];
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent = $event->data->object;
            $order  = Order::where('payment_intent_id', $intent->id)->first();
            if ($order && $order->payment_status !== 'paid') {
                $order->update([
                    'status'               => 'processing',
                    'payment_status'       => 'paid',
                    'payment_method_type'  => $intent->payment_method_types[0] ?? 'card',
                    'paid_at'              => now(),
                ]);

                // Clear cart
                $cart = \App\Models\Cart::where('user_id', $order->user_id)
                    ->orWhere('session_id', session()->getId())
                    ->first();
                if ($cart) {
                    $cart->items()->delete();
                    $cart->delete();
                }

                $order->notes()->create([
                    'content' => 'Payment confirmed via Stripe. Payment Intent: ' . $intent->id,
                    'type'    => 'system',
                ]);
            }
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $intent = $event->data->object;
            $order  = Order::where('payment_intent_id', $intent->id)->first();
            if ($order) {
                $order->update([
                    'status'         => 'cancelled',
                    'payment_status' => 'failed',
                ]);
                $order->notes()->create([
                    'content' => 'Payment failed. Reason: ' . ($intent->last_payment_error->message ?? 'Unknown'),
                    'type'    => 'system',
                ]);
            }
        }

        return response()->json(['received' => true]);
    }
}
