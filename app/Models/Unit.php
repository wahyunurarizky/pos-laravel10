<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Unit extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'units';

    public $timestamps = false;

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function children()
    {
        return $this->hasOne(self::class, 'parent_id');
    }

    public function grandchildren()
    {
        return $this->children()->with('grandchildren');
    }

    public function pricings(): HasMany
    {
        return $this->hasMany(Pricing::class);
    }
    public function pricing(): HasOne
    {
        return $this->hasOne(Pricing::class)->orderBy('created_at', 'ASC');
    }
}
