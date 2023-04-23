<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(protected BalanceService $balanceService)
    {
    }

    public function home()
    {
        return Inertia::render('Home');
    }
    public function debtBond()
    {
        return Inertia::render('DebtBond/Index');
    }
}
