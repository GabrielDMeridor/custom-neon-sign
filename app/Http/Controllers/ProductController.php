<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category', 'all');

        $products = Product::active()
            ->when($category !== 'all', fn($q) => $q->where('category', $category))
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Catalog', [
            'products' => $products,
            'category' => $category,
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('Product', [
            'product' => $product,
        ]);
    }

    public function apiIndex(Request $request)
    {
        $category = $request->query('category', 'all');
        $products = Product::active()
            ->when($category !== 'all', fn($q) => $q->where('category', $category))
            ->get();
        return response()->json($products);
    }
}
