<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CashflowService;
use Illuminate\Http\Request;

class ApiCashflowController extends Controller
{
    public function __construct(protected CashflowService $cashflowService)
    {
    }
    public function show($id)
    {
        try {
            $cashflow = $this->cashflowService->getById($id);

            return response()->json($cashflow);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }
}
