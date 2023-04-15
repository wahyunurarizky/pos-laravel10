<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'purchases';

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class, 'seller_id', 'id');
    }
}
