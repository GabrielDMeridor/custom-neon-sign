<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/Products/Index', compact('products'));
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Form', ['product' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);
        if ($request->hasFile('image_file')) {
            $data['image'] = '/storage/' . $request->file('image_file')->store('products', 'public');
        }
        unset($data['image_file']);
        Product::create($data);
        return redirect()->route('admin.products.index')->with('success', 'Product created.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Form', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);
        if ($request->hasFile('image_file')) {
            $data['image'] = '/storage/' . $request->file('image_file')->store('products', 'public');
        }
        unset($data['image_file']);
        $product->update($data);
        return redirect()->route('admin.products.index')->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Product deleted.');
    }

    public function toggleActive(Product $product)
    {
        $product->update(['active' => ! $product->active]);
        return back();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'category'        => 'required|in:prebuilt,custom',
            'base_price'      => 'required|numeric|min:0',
            'image'           => 'nullable|string',
            'font'            => 'nullable|string|max:100',
            'image_file'      => 'nullable|image|max:5120',
            'is_customizable' => 'boolean',
            'active'          => 'boolean',
            'colors'          => 'nullable|array',
            'sizes'           => 'nullable|array',
        ]);
    }
}
