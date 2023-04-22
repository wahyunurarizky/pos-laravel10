<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use App\Services\HistoryBalanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalanceController extends Controller
{

    public function __construct(
        protected BalanceService $balanceService,
        protected HistoryBalanceService $historyBalanceService
    ) {
    }

    public function show($id, Request $request)
    {

        $q = $request->q;
        $page = $request->page ?? 1;
        $perPage = $request->per_page ?? 10;

        $balance = $this->balanceService->getById($id);
        $history_balance = $this->historyBalanceService->getAllPaginate($perPage, $q, $page);

        if ($page > $history_balance->lastPage()) {
            return to_route('items.index', ['q' => $q]);
        }


        return Inertia::render('Balance/Show', ['balance' => $balance, 'history_balance' => $history_balance, 'q' => $q]);
    }
}
