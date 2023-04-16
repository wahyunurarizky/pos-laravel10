<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemSale;
use App\Models\Pricing;
use App\Models\Sale;
use App\Models\Unit;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SaleController extends Controller
{
    function __construct(protected SaleService $saleService)
    {
    }

    public function sell()
    {
        return Inertia::render('Item/Sale/Sell');
    }

    public function saveSell(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric'
        ]);

        $sellItems = [];

        foreach ($request->items as $key => $item) {
            $sellItems[] = [
                'item_id' => @$item['item_id'],
                'unit_id' => @$item['unit_id'],
                'per_unit_qty' => @$item['per_unit_qty'],
                'price_per_unit' => @$item['price_per_unit'],
                'total' => @$item['total'],
                'sub_name' => @$item['sub_name'],
            ];
        }

        $this->saleService->sellItems($sellItems);

        return to_route('items.index')->with('message', 'berhasil melakukan penjualan');
    }
}
