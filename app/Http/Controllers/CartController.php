<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CartController extends Controller
{
    private function resolveCart(): Cart
    {
        $sessionId = Session::getId();
        $userId = auth()->id();

        $cart = Cart::with('items.product')
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id'    => $userId,
                'session_id' => $sessionId,
            ]);
            $cart->load('items.product');
        }

        return $cart;
    }

    public function index()
    {
        $cart = $this->resolveCart();
        return Inertia::render('Cart', [
            'cart' => $cart,
        ]);
    }

    public function add(Request $request)
    {
        $data = $request->validate([
            'product_id'  => 'nullable|exists:products,id',
            'quantity'    => 'required|integer|min:1',
            'unit_price'  => 'required|numeric|min:0',
            'neon_color'  => 'nullable|string|max:50',
            'size'        => 'nullable|string|max:50',
            'background'  => 'nullable|string|max:100',
            'custom_text' => 'nullable|string|max:200',
            'font'        => 'nullable|string|max:100',
            'design_data' => 'nullable|array',
        ]);

        $cart = $this->resolveCart();
        $cart->items()->create($data + ['cart_id' => $cart->id]);
        $cart->load('items.product');

        return response()->json([
            'message' => 'Item added to cart',
            'cart'    => $cart,
        ]);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $cartItem->update($data);
        return response()->json(['message' => 'Cart updated']);
    }

    public function remove(CartItem $cartItem)
    {
        $cartItem->delete();
        return response()->json(['message' => 'Item removed']);
    }

    public function count()
    {
        $cart = $this->resolveCart();
        return response()->json(['count' => $cart->item_count]);
    }
}

