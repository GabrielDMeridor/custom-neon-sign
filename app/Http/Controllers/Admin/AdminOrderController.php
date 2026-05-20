<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\StripeClient;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('items')->latest();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($payment = $request->get('payment_status')) {
            $query->where('payment_status', $payment);
        }

        $orders = $query->paginate(20)->withQueryString();

        $stats = [
            'total'            => Order::count(),
            'pending_payment'  => Order::where('status', 'pending_payment')->count(),
            'processing'       => Order::where('status', 'processing')->count(),
            'on_hold'          => Order::where('status', 'on_hold')->count(),
            'completed'        => Order::where('status', 'completed')->count(),
            'cancelled'        => Order::where('status', 'cancelled')->count(),
            'refunded'         => Order::where('status', 'refunded')->count(),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders'  => $orders,
            'stats'   => $stats,
            'filters' => $request->only(['search', 'status', 'payment_status']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['items.product', 'notes' => fn($q) => $q->latest()]);
        return Inertia::render('Admin/Orders/Show', compact('order'));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:pending_payment,processing,on_hold,completed,cancelled,refunded',
        ]);

        $old     = $order->status;
        $updates = ['status' => $data['status']];

        // Guard: cannot move to processing or completed while payment is unconfirmed
        if (in_array($data['status'], ['processing', 'completed']) && $order->payment_status !== 'paid') {
            return back()->with('error', 'Payment must be confirmed before this order can be marked as "' . $data['status'] . '".');
        }

        // Auto-set timestamps based on transition
        if ($data['status'] === 'completed') {
            if (!$order->shipped_at)   $updates['shipped_at']   = now();
            if (!$order->completed_at) $updates['completed_at'] = now();
        }

        // Sync payment_status when manually marking as refunded
        if ($data['status'] === 'refunded' && $order->payment_status !== 'refunded') {
            $updates['payment_status'] = 'refunded';
        }

        $order->update($updates);

        $order->notes()->create([
            'user_id' => auth()->id(),
            'content' => "Status changed from \"{$old}\" to \"{$data['status']}\".",
            'type'    => 'system',
        ]);

        return back()->with('success', 'Order status updated.');
    }

    public function addNote(Request $request, Order $order)
    {
        $data = $request->validate([
            'content'         => 'required|string|max:2000',
            'notify_customer' => 'boolean',
        ]);

        $order->notes()->create([
            'user_id'         => auth()->id(),
            'content'         => $data['content'],
            'type'            => 'admin',
            'notify_customer' => $data['notify_customer'] ?? false,
        ]);

        return back()->with('success', 'Note added.');
    }

    public function destroy(Order $order)
    {
        $order->notes()->delete();
        $order->items()->delete();
        $order->delete();
        return redirect()->route('admin.orders.index')->with('success', 'Order deleted.');
    }

    public function syncAll()
    {
        $orders = Order::where('payment_status', '!=', 'paid')
            ->whereNotNull('payment_intent_id')
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->get();

        if ($orders->isEmpty()) {
            return back()->with('success', 'No unpaid orders with Stripe Payment Intents found.');
        }

        $stripe  = new StripeClient(config('services.stripe.secret'));
        $synced  = 0;
        $skipped = 0;
        $errors  = 0;

        foreach ($orders as $order) {
            try {
                $intent = $stripe->paymentIntents->retrieve($order->payment_intent_id);
                if ($intent->status === 'succeeded') {
                    $order->update([
                        'status'              => 'processing',
                        'payment_status'      => 'paid',
                        'payment_method_type' => $intent->payment_method_types[0] ?? 'card',
                        'paid_at'             => now(),
                    ]);
                    $order->notes()->create([
                        'user_id' => auth()->id(),
                        'content' => 'Payment confirmed via bulk sync. Stripe Intent: ' . $intent->id,
                        'type'    => 'system',
                    ]);
                    $synced++;
                } else {
                    $skipped++;
                }
            } catch (\Exception $e) {
                Log::error("syncAll [{$order->order_number}]: " . $e->getMessage());
                $errors++;
            }
        }

        $total = $orders->count();
        $msg   = "Checked {$total} order(s). {$synced} updated to Paid / Processing.";
        if ($skipped) $msg .= " {$skipped} not yet paid in Stripe.";
        if ($errors)  $msg .= " {$errors} could not be reached.";

        return back()->with('success', $msg);
    }

    public function syncPayment(Order $order)
    {
        if ($order->payment_status === 'paid') {
            return back()->with('success', 'Order is already marked as paid.');
        }

        if (!$order->payment_intent_id) {
            return back()->with('error', 'No Stripe Payment Intent linked to this order.');
        }

        try {
            $stripe = new StripeClient(config('services.stripe.secret'));
            $intent = $stripe->paymentIntents->retrieve($order->payment_intent_id);
        } catch (\Exception $e) {
            Log::error("Admin syncPayment [{$order->order_number}]: " . $e->getMessage());
            return back()->with('error', 'Could not reach Stripe. Please try again.');
        }

        if ($intent->status === 'succeeded') {
            $order->update([
                'status'              => 'processing',
                'payment_status'      => 'paid',
                'payment_method_type' => $intent->payment_method_types[0] ?? 'card',
                'paid_at'             => now(),
            ]);

            $order->notes()->create([
                'user_id' => auth()->id(),
                'content' => 'Payment confirmed via admin sync. Stripe Intent: ' . $intent->id,
                'type'    => 'system',
            ]);

            return back()->with('success', 'Payment verified — order updated to Processing / Paid.');
        }

        return back()->with('info', "Stripe reports payment as \"{$intent->status}\". Order status not changed.");
    }
}
