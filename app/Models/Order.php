<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'customer_name', 'customer_email',
        'customer_phone', 'shipping_address', 'subtotal', 'shipping',
        'total', 'status', 'payment_status', 'payment_intent_id',
        'payment_method_type', 'currency', 'customer_notes',
        'paid_at', 'shipped_at', 'completed_at',
    ];

    protected $casts = [
        'subtotal'     => 'decimal:2',
        'shipping'     => 'decimal:2',
        'total'        => 'decimal:2',
        'paid_at'      => 'datetime',
        'shipped_at'   => 'datetime',
        'completed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'NSA-' . strtoupper(Str::random(8));
            }
        });
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function notes()
    {
        return $this->hasMany(OrderNote::class);
    }
}
