<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalanceController extends Controller
{

    public function __construct(protected BalanceService $balanceService)
    {
    }

    public function show($id)
    {
        $balance = $this->balanceService->getById($id);

        return Inertia::render('Balance/Show', ['balance' => $balance]);
    }
}
