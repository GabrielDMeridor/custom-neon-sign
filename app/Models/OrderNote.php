<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderNote extends Model
{
    protected $fillable = ['order_id', 'user_id', 'content', 'type', 'notify_customer'];

    protected $casts = ['notify_customer' => 'boolean'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
