<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use App\Services\DebtService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DebtController extends Controller
{
    public function __construct(protected DebtService $debtService, protected BalanceService $balanceService)
    {
    }

    public function index(Request $request)
    {
        $q = $request->q;
        $page = $request->page ?? 1;
        $perPage = $request->per_page ?? 10;

        $balances = $this->balanceService->getAllBalance();

        $debts = $this->debtService->getAllPaginate($perPage, $q, $page);

        if ($page > $debts->lastPage()) {
            return to_route('debts.index', ['q' => $q]);
        }

        return Inertia::render('Debt/Debt', ['debts' => $debts, 'balances' => $balances, 'q' => $q]);
    }

    public function store(Request $request)
    {
        $this->debtService->create($request->all());
        return to_route('debts.index')->with('message', 'berhasil menambah data');
    }
}
