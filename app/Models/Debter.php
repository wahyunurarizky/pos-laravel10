<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Debter extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'debters';

    public function debts(): HasMany
    {
        return $this->hasMany(Debt::class);
    }
}
