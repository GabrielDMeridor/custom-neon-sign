<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\LogoController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\GalleryItemController;
use App\Http\Controllers\Admin\ContentController;
use App\Models\GalleryItem;
use App\Models\SiteContent;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home
Route::get('/', function () {
    return Inertia::render('Home', [
        'hero'        => SiteContent::forSection('hero'),
        'stats'       => SiteContent::forSection('stats'),
        'howItWorks'  => SiteContent::forSection('how_it_works'),
        'global'      => SiteContent::forSection('global'),
    ]);
})->name('home');

// Catalog
Route::get('/catalog', [ProductController::class, 'index'])->name('catalog.index');
Route::get('/catalog/{product:slug}', [ProductController::class, 'show'])->name('catalog.show');

// Designer
Route::get('/designer', function () {
    return Inertia::render('Designer');
})->name('designer');

// Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');

// Checkout
Route::get('/checkout', [OrderController::class, 'create'])->name('checkout.create');
Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');

// Stripe
Route::post('/stripe/webhook', [StripeController::class, 'webhook'])->name('stripe.webhook');

// Order confirmation
Route::get('/order-confirmation/{orderNumber?}', function ($orderNumber = null) {
    $order = $orderNumber
        ? \App\Models\Order::with('items')->where('order_number', $orderNumber)->first()
        : null;
    return \Inertia\Inertia::render('OrderConfirmation', ['order' => $order]);
})->name('order.confirmation');

// Extra pages
Route::get('/logo-upload', function () { return Inertia::render('LogoUpload'); })->name('logo-upload');
Route::get('/gallery',     function () { return Inertia::render('Gallery', ['items' => GalleryItem::active()->orderBy('sort_order')->get()]); })->name('gallery');
Route::get('/about', function () {
    return Inertia::render('About', [
        'content' => SiteContent::forSection('about'),
    ]);
})->name('about');
Route::get('/faq',         function () { return Inertia::render('Faq');       })->name('faq');

// Dashboard redirect (used by Breeze auth controllers after login)
Route::get('/dashboard', function () {
    return auth()->user()?->is_admin
        ? redirect()->route('admin.dashboard')
        : redirect()->route('home');
})->middleware('auth')->name('dashboard');

// Auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// API routes (JSON)
Route::prefix('api')->group(function () {
    Route::get('/products', [ProductController::class, 'apiIndex']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::patch('/cart/items/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'remove']);
    Route::get('/cart/count', [CartController::class, 'count']);
    Route::post('/upload-logo', [LogoController::class, 'upload']);
    Route::post('/checkout/intent', [StripeController::class, 'createIntent']);
    Route::post('/checkout/sync/{orderNumber}', [StripeController::class, 'syncPayment']);
});

// Admin panel
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/',                                  [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/products',                          [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/products/create',                   [AdminProductController::class, 'create'])->name('products.create');
    Route::post('/products',                         [AdminProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit',           [AdminProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}',                [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}',             [AdminProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/products/{product}/toggle',        [AdminProductController::class, 'toggleActive'])->name('products.toggle');
    // Orders
    Route::get('/orders',                            [AdminOrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/sync-all',                  [AdminOrderController::class, 'syncAll'])->name('orders.sync-all');
    Route::get('/orders/{order}',                    [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status',           [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    Route::post('/orders/{order}/sync',              [AdminOrderController::class, 'syncPayment'])->name('orders.sync');
    Route::post('/orders/{order}/notes',             [AdminOrderController::class, 'addNote'])->name('orders.notes');
    Route::delete('/orders/{order}',                 [AdminOrderController::class, 'destroy'])->name('orders.destroy');
    // Gallery
    Route::get('/gallery',                           [GalleryItemController::class, 'index'])->name('gallery.index');
    Route::get('/gallery/create',                    [GalleryItemController::class, 'create'])->name('gallery.create');
    Route::post('/gallery',                          [GalleryItemController::class, 'store'])->name('gallery.store');
    Route::get('/gallery/{galleryItem}/edit',        [GalleryItemController::class, 'edit'])->name('gallery.edit');
    Route::put('/gallery/{galleryItem}',             [GalleryItemController::class, 'update'])->name('gallery.update');
    Route::delete('/gallery/{galleryItem}',          [GalleryItemController::class, 'destroy'])->name('gallery.destroy');
    Route::post('/gallery/{galleryItem}/toggle',     [GalleryItemController::class, 'toggleActive'])->name('gallery.toggle');
    Route::get('/content',                           [ContentController::class, 'index'])->name('content.index');
    Route::get('/content/{section}',                 [ContentController::class, 'edit'])->name('content.edit');
    Route::put('/content/{section}',                 [ContentController::class, 'update'])->name('content.update');
});

require __DIR__.'/auth.php';

