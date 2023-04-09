<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Services\Item\ItemService;
use Illuminate\Http\Request;

class ApiItemController extends Controller
{
    public function __construct(protected ItemService $itemService)
    {
    }

    public function index(Request $request)
    {
        try {
            $items = $this->itemService->getAll(whereClause: [], limit: 10, q: $request->q);
            return response()->json($items);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }

    public function checkUniqueName(Request $request)
    {
        try {
            return $this->itemService->checkNameAlreadyExists($request->name);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }

    public function show($id)
    {
        try {
            $item = $this->itemService->findByIdWithPricing($id);

            return response()->json($item);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }

    public function checkAvailableStock(Request $request)
    {
        try {
            $res =  $this->itemService->checkAvailableStock($request->unit_id, $request->per_unit_qty);

            return response()->json($res);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }
}
