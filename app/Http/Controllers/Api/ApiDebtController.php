<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DebtService;
use Illuminate\Http\Request;

class ApiDebtController extends Controller
{
    public function __construct(protected DebtService $debtService)
    {
    }

    public function index(Request $request)
    {

        try {
            $q = $request->q;
            $page = $request->page ?? 1;
            $perPage = $request->per_page ?? 10;
            $debter_id = $request->debter_id;
            $debters = $this->debtService->getAllPaginate($perPage, $q, $page, ['debter_id' => $debter_id]);

            return response()->json($debters);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }
}
