<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterUnit extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'master_units';

    public $timestamps = false;

    protected $casts = [
        'name' => 'array',
    ];
}
