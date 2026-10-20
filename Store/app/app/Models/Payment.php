<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'product_id',
        'stripe_payment_intent_id',
        'amount',
        'currency',
        'customer_email',
        'customer_name',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
