<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Debt extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'debts';

    public function balance(): BelongsTo
    {
        return $this->belongsTo(Balance::class, 'balance_id', 'id');
    }

    public function debter(): BelongsTo
    {
        return $this->belongsTo(Debter::class, 'debter_id', 'id');
    }
}
