<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cashflow extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'cashflows';

    public function balance(): BelongsTo
    {
        return $this->belongsTo(Balance::class, 'balance_id', 'id');
    }
}
