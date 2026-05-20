<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create()
    {
        $sessionId = Session::getId();
        $userId = auth()->id();

        $cart = Cart::with('items.product')
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('Checkout', [
            'cart' => $cart,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name'     => 'required|string|max:100',
            'customer_email'    => 'required|email|max:150',
            'customer_phone'    => 'nullable|string|max:30',
            'shipping_address'  => 'required|string|max:500',
        ]);

        $sessionId = Session::getId();
        $userId = auth()->id();

        $cart = Cart::with('items.product')
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->firstOrFail();

        $subtotal = $cart->items->sum(fn($i) => $i->unit_price * $i->quantity);
        $shipping = 15.00;
        $total    = $subtotal + $shipping;

        $order = DB::transaction(function () use ($data, $cart, $subtotal, $shipping, $total, $userId) {
            $order = Order::create(array_merge($data, [
                'user_id'  => $userId,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total'    => $total,
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

            $cart->items()->delete();
            $cart->delete();

            return $order;
        });

        return Inertia::render('OrderConfirmation', [
            'order' => $order->load('items'),
        ]);
    }
}
