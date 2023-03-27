<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    use HasFactory;

    protected $perPage = 10;

    protected $guarded = ['id'];

    protected $table = 'items';

    protected $casts = [
        'sub_name' => 'json',
    ];

    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }


    public function bottomUnit()
    {
        return $this->hasOne(Unit::class)->orderBy('id', 'DESC');
    }
}
