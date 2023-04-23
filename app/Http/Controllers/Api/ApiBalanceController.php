<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BalanceService;
use Illuminate\Http\Request;

class ApiBalanceController extends Controller
{
    public function __construct(protected BalanceService $balanceService)
    {
    }

    public function index()
    {
        try {
            $balances = $this->balanceService->getAllBalance();
            return response()->json($balances);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }
}
