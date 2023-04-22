<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use App\Services\CashflowService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashflowController extends Controller
{
    public function __construct(protected CashflowService $cashflowService, protected BalanceService $balanceService)
    {
    }

    public function index(Request $request)
    {
        $q = $request->q;
        $page = $request->page;
        $perPage = $request->per_page ?? 10;

        $cashflows = $this->cashflowService->getAllPaginate($perPage, $q);
        $balances = $this->balanceService->getAllBalance();

        if ($page > $cashflows->lastPage()) {
            return to_route('cashflows.index', ['q' => $q]);
        }

        return Inertia::render('Cashflow/Cashflow', ['cashflows' => $cashflows, 'balances' => $balances, 'q' => $q]);
    }

    public function store(Request $request)
    {
        $this->cashflowService->createCashflow($request->all());
        return to_route('cashflows.index')->with('message', 'berhasil menambah data');
    }

    public function update(Request $request, $id)
    {
        $this->cashflowService->updateById($id, $request->all());
        return to_route('cashflows.index')->with('message', 'berhasil merubah data');
    }
}
