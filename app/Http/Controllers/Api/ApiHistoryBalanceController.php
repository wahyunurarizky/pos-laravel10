<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HistoryBalanceService;
use Illuminate\Http\Request;

class ApiHistoryBalanceController extends Controller
{
    public function __construct(protected HistoryBalanceService $historyBalanceService)
    {
    }
    public function show($id)
    {
        try {
            $historyBalance = $this->historyBalanceService->getById($id);

            return response()->json($historyBalance);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }
}
