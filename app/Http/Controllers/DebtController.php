<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use App\Services\DebterService;
use App\Services\DebtService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DebtController extends Controller
{
    public function __construct(
        protected DebterService $debterService,
        protected DebtService $debtService,
        protected BalanceService $balanceService
    ) {
    }

    public function debters(Request $request)
    {
        $q = $request->q;
        $page = $request->page ?? 1;
        $perPage = $request->per_page ?? 10;

        $balances = $this->balanceService->getAllBalance();

        $debters = $this->debterService->getAllPaginate($perPage, $q, $page, ['type' => 'debt']);

        if ($page > $debters->lastPage()) {
            return to_route('debters.index', ['q' => $q]);
        }

        return Inertia::render('Debt/Debt', ['debters' => $debters, 'balances' => $balances, 'q' => $q]);
    }

    public function debts($id, Request $request)
    {
        $q = $request->q;
        $page = $request->page ?? 1;
        $perPage = $request->per_page ?? 10;

        $debt = $this->debtService->getAllPaginate($perPage, $q, $page, ['debter_id' => $id]);

        if ($page > $debt->lastPage()) {
            return to_route('debters.index', ['q' => $q]);
        }
        return Inertia::render('Debt/ShowDetail', ['debts' => $debt, 'q' => $q, 'id' => $id]);
    }

    public function store(Request $request)
    {
        $this->debtService->create($request->all());
        return to_route('debters.index')->with('message', 'berhasil menambah data');
    }
}
