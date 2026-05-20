<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = now();

        // Revenue from paid orders
        $revenueToday  = Order::where('payment_status', 'paid')->whereDate('paid_at', $now)->sum('total');
        $revenueWeek   = Order::where('payment_status', 'paid')->whereBetween('paid_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->sum('total');
        $revenueMonth  = Order::where('payment_status', 'paid')->whereMonth('paid_at', $now->month)->whereYear('paid_at', $now->year)->sum('total');
        $revenueTotal  = Order::where('payment_status', 'paid')->sum('total');

        // Order counts by status
        $orderStats = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        // Daily revenue last 30 days
        $dailyRevenue = Order::where('payment_status', 'paid')
            ->where('paid_at', '>=', $now->copy()->subDays(29)->startOfDay())
            ->select(DB::raw('DATE(paid_at) as date'), DB::raw('SUM(total) as revenue'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date')
            ->map(fn($r) => round((float) $r->revenue, 2));

        // Fill missing days with 0
        $chartDays = [];
        for ($i = 29; $i >= 0; $i--) {
            $date          = $now->copy()->subDays($i)->toDateString();
            $chartDays[]   = ['date' => $date, 'revenue' => $dailyRevenue[$date]->revenue ?? 0];
        }

        // Top products by revenue
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid')
            ->select('order_items.product_name', DB::raw('SUM(order_items.unit_price * order_items.quantity) as revenue'), DB::raw('SUM(order_items.quantity) as units'))
            ->groupBy('order_items.product_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        // Recent orders
        $recentOrders = Order::latest()->limit(10)->get([
            'id', 'order_number', 'customer_name', 'customer_email',
            'total', 'status', 'payment_status', 'created_at',
        ]);

        $stats = [
            'products'        => Product::count(),
            'active_products' => Product::where('active', true)->count(),
            'gallery_items'   => GalleryItem::count(),
            'orders'          => Order::count(),
            'revenue_today'   => round((float) $revenueToday, 2),
            'revenue_week'    => round((float) $revenueWeek, 2),
            'revenue_month'   => round((float) $revenueMonth, 2),
            'revenue_total'   => round((float) $revenueTotal, 2),
        ];

        $recentProducts = Product::latest()->limit(5)->get(['id', 'name', 'category', 'base_price', 'active']);

        return Inertia::render('Admin/Dashboard', compact(
            'stats', 'recentProducts', 'orderStats', 'chartDays', 'topProducts', 'recentOrders'
        ));
    }
}

