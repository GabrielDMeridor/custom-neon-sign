<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id', 'product_id', 'product_name', 'quantity', 'unit_price',
        'neon_color', 'size', 'background', 'custom_text', 'font', 'design_data',
    ];

    protected $casts = [
        'design_data' => 'array',
        'unit_price'  => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
