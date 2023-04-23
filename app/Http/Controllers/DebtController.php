<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use App\Services\DebterService;
use App\Services\DebtService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DebtController extends Controller
{
    public function __construct(protected DebterService $debterService, protected DebtService $debtService, protected BalanceService $balanceService)
    {
    }

    public function index(Request $request)
    {
        $q = $request->q;
        $page = $request->page ?? 1;
        $perPage = $request->per_page ?? 10;

        $balances = $this->balanceService->getAllBalance();

        $debters = $this->debterService->getAllPaginate($perPage, $q, $page);

        if ($page > $debters->lastPage()) {
            return to_route('debters.index', ['q' => $q]);
        }

        return Inertia::render('Debt/Debt', ['debters' => $debters, 'balances' => $balances, 'q' => $q]);
    }

    public function debts()
    {
        return Inertia::render('Debt/ShowDetail');
    }

    public function store(Request $request)
    {
        $this->debtService->create($request->all());
        return to_route('debters.index')->with('message', 'berhasil menambah data');
    }
}
