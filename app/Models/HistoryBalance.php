<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HistoryBalance extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    protected $table = 'history_balances';

    public function balance(): BelongsTo
    {
        return $this->belongsTo(Balance::class, 'balance_id', 'id');
    }

    // public function cashflow(): BelongsTo
    // {
    //     return $this->belongsTo(Cashflow::class, 'transaction_id', 'id')->where('history_balances.type', '=', 'cashflow');
    // }
}
