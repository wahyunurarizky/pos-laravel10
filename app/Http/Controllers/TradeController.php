<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TradeController extends Controller
{
    public function index()
    {
        return Inertia::render('Trade/Index');
    }
}
