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

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function grandparent()
    {
        return $this->parent()->with('grandparent');
    }

    public function pricings(): HasMany
    {
        return $this->hasMany(Pricing::class);
    }

    public function pricing(): HasOne
    {
        return $this->hasOne(Pricing::class)->latest('created_at');
    }

    public function itemPurchase(): HasOne
    {
        return $this->hasOne(ItemPurchase::class)->latest('created_at');
    }

    public function calcParent($qty)
    {

        if ($this->parent) {
            $div = intdiv($qty, $this->parent_ref_qty ?? 1);
            $num = $qty % $this->parent_ref_qty;
            return [$num . " " . $this->name, ...$this->parent->calcParent($div)];
        }
        return [floatval($qty) . " " .  $this->name];
    }

    public function calcChild($qty)
    {

        if ($this->children) {
            $num = intdiv($qty, $this->children->parent_ref_qty ?? 1);
            $mod = $qty % $this->children->parent_ref_qty ?? 1;
            return $num . ' ' . $this->name . ', ' . $this->children->calcChild($mod);
        }
        return floatval(number_format($qty, 2)) . ' ' . $this->name;
    }
}
