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
            'total' => 'required|numeric',
            'balance_id' => 'numeric',
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

        $this->saleService->sellItems($sellItems, $request->balance_id ?? 1);

        return to_route('items.index')->with('message', 'berhasil melakukan penjualan');
    }


    public function historySell(Request $request)
    {

        $q = $request->q;
        $page = $request->page;
        $perPage = $request->per_page ?? 10;

        $item_sales = $this->saleService->getAllItemSalePaginate($perPage, $q);
        if ($page > $item_sales->lastPage()) {
            return to_route('items.history-sell', ['q' => $q]);
        }

        return Inertia::render('Item/Sale/History', ['item_sales' => $item_sales, 'q' => $q]);
    }
}
