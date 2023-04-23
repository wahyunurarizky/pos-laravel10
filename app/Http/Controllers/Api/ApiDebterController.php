<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DebterService;
use Illuminate\Http\Request;

class ApiDebterController extends Controller
{
    public function __construct(protected DebterService $debterService)
    {
    }

    public function index()
    {
        try {
            $debters = $this->debterService->getAll();
            return response()->json($debters);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $debters = $this->debterService->create($request->all());
            return response()->json($debters);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }

    public function show($id)
    {
        try {
            $debter = $this->debterService->getById($id);

            return response()->json($debter);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], $th->getCode() ?: 500);
        }
    }
}
