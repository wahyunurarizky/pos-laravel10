<?php

namespace App\Http\Controllers;

use App\Services\CashflowService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashflowController extends Controller
{
    public function __construct(protected CashflowService $cashflowService)
    {
    }

    public function index(Request $request)
    {
        $q = $request->q;
        $page = $request->page;
        $perPage = $request->per_page ?? 10;

        $cashflows = $this->cashflowService->getAllPaginate($perPage, $q);

        if ($page > $cashflows->lastPage()) {
            return to_route('cashflows.index', ['q' => $q]);
        }

        return Inertia::render('Cashflow/Cashflow', ['cashflows' => $cashflows, 'q' => $q]);
    }
}
