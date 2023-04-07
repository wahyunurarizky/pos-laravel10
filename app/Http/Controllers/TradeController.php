<?php

namespace App\Http\Controllers;

use App\Models\MasterUnit;
use App\Models\Purchase;
use App\Services\Item\ItemService;
use App\Services\Purchase\PurchaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TradeController extends Controller
{
    public function __construct(protected ItemService $itemService, protected PurchaseService $purchaseService)
    {
    }

    public function index(Request $request)
    {
        $q = $request->q;
        $page = $request->page;
        $perPage = $request->per_page ?? 10;

        $items = $this->itemService->getAllPaginate($perPage, $q);

        if ($page > $items->lastPage()) {
            return to_route('trade.index', ['q' => $q]);
        }

        return Inertia::render('Trade/Index', ['items' => $items, 'q' => $q]);
    }

    public function buy()
    {
        $master_units = MasterUnit::all();
        return Inertia::render('Trade/Buy', ['master_units' => $master_units]);
    }

    public function createBuy(Request $request)
    {

        $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric'
        ]);

        $newItemBuys = [];
        $newItemValidates = [];

        $oldItemBuys = [];
        $oldItemValidates = [];

        foreach ($request->items as $key => $item) {
            if (@$item['isNew']) {
                $data = [
                    'name' => Str::upper(@$item['name']),
                    'master_unit_id' => @$item['master_unit_id'],
                    'sub_name' => @$item['sub_name'],
                    'units' => @$item['units'],
                    'unit_name' => @$item['unit_name'],
                    'per_unit_qty' => @$item['per_unit_qty'],
                    'price_per_unit' => @$item['price_per_unit'],
                    'total' => @$item['total'],
                    'seller_id' => @$item['seller_id']
                ];

                $newItemBuys[] = $data;
                $newItemValidates[$key] = [...$data, 'units' => Arr::except($data['units'], [0])];
            } else {
                $data = [
                    'item_id' => @$item['item_id'],
                    'units' => @$item['units'],
                    'unit_id' => @$item['unit_id'],
                    'per_unit_qty' => @$item['per_unit_qty'],
                    'price_per_unit' => @$item['price_per_unit'],
                    'total' => @$item['total'],
                    'seller_id' => @$item['seller_id']
                ];

                $oldItemBuys[] = $data;
                $oldItemValidates[$key] = $data;
            }
        }

        $this->purchaseService->validateNewItems($newItemValidates);
        $this->purchaseService->validateOldItems($oldItemValidates);

        $purchase = Purchase::create([
            'total' => $request->total,
        ]);

        $oldItemBuys = collect($oldItemBuys)->map(function ($item) use ($purchase) {
            $item['purchase_id'] = $purchase->id;
            return $item;
        });
        $newItemBuys = collect($newItemBuys)->map(function ($item) use ($purchase) {
            $item['purchase_id'] = $purchase->id;
            return $item;
        });

        $this->purchaseService->insertOldItem($oldItemBuys);
        $this->purchaseService->insertNewItem($newItemBuys);

        return to_route('trade.index')->with('message', 'berhasil menambahkan data');
    }

    public function sell()
    {
        return Inertia::render('Trade/Sell');
    }
}
