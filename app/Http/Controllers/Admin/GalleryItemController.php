<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryItemController extends Controller
{
    public function index()
    {
        $items = GalleryItem::orderBy('sort_order')->orderBy('id')->get();
        return Inertia::render('Admin/Gallery/Index', compact('items'));
    }

    public function create()
    {
        return Inertia::render('Admin/Gallery/Form', ['item' => null]);
    }

    public function store(Request $request)
    {
        GalleryItem::create($this->validated($request));
        return redirect()->route('admin.gallery.index')->with('success', 'Gallery item created.');
    }

    public function edit(GalleryItem $galleryItem)
    {
        return Inertia::render('Admin/Gallery/Form', ['item' => $galleryItem]);
    }

    public function update(Request $request, GalleryItem $galleryItem)
    {
        $galleryItem->update($this->validated($request));
        return redirect()->route('admin.gallery.index')->with('success', 'Gallery item updated.');
    }

    public function destroy(GalleryItem $galleryItem)
    {
        $galleryItem->delete();
        return back()->with('success', 'Item deleted.');
    }

    public function toggleActive(GalleryItem $galleryItem)
    {
        $galleryItem->update(['active' => ! $galleryItem->active]);
        return back();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title'       => 'required|string|max:255',
            'category'    => 'required|string|max:60',
            'color'       => 'required|string|max:20',
            'emoji'       => 'nullable|string|max:10',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|string|max:500',
            'badge'       => 'nullable|string|max:30',
            'sort_order'  => 'integer',
            'active'      => 'boolean',
        ]);
    }
}
