<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Cashflow extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'cashflows';

    public function balance(): BelongsTo
    {
        return $this->belongsTo(Balance::class, 'balance_id', 'id');
    }

    public function history(): HasOne
    {
        return $this->hasOne(HistoryBalance::class, 'transaction_id', 'id')->where('history_balances.type', '=', 'cashflow');
    }
}
