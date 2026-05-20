<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id', 'product_id', 'quantity', 'unit_price',
        'neon_color', 'size', 'background', 'custom_text', 'font', 'design_data',
    ];

    protected $casts = [
        'design_data' => 'array',
        'unit_price'  => 'decimal:2',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getLineTotalAttribute()
    {
        return $this->unit_price * $this->quantity;
    }
}
