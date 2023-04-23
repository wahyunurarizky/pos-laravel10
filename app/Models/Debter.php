<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Debter extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'debters';
}
