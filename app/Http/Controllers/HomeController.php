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
        $balances = $this->balanceService->getAllBalance();

        return Inertia::render('Home', ['balances' => $balances]);
    }
}
