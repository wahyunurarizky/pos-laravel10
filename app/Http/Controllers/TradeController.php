<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemPurchase;
use App\Models\ItemSale;
use App\Models\MasterUnit;
use App\Models\Pricing;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Unit;
use App\Services\Item\ItemService;
use App\Services\Purchase\PurchaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
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

    public function createSell(Request $request)
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

        Validator::make($sellItems, [
            '*.per_unit_qty' => 'required|numeric',
            '*.item_id' => 'required|numeric',
            '*.price_per_unit' => 'required|numeric',
            '*.total' => 'required',
            '*.unit_id' => 'required|numeric',
        ])->stopOnFirstFailure()->validate();

        collect($sellItems)->each(function ($d) {
            $available = $this->itemService->checkAvailableStock($d['unit_id'], $d['per_unit_qty']);
            if (!$available) {
                throw ValidationException::withMessages([
                    'stock' => 'stock not available',
                ]);
            }
        });

        $sales = Sale::create([
            'total' => $request->total,
        ]);
        $sellItems = collect($sellItems)->map(function ($d) use ($sales) {
            $bottomUnitQty = $d['per_unit_qty'];
            $unitPurchase = Unit::find($d['unit_id']);
            if ($unitPurchase->children) {
                $bottomUnitQty = $bottomUnitQty * $this->calcChildren($unitPurchase->children);
            }

            $pricing = Pricing::firstOrCreate(['unit_id' => $d['unit_id']]);
            if (floatval($pricing->price) != floatval($d['price_per_unit'])) $pricing->update(['price' => $d['price_per_unit']]);

            $item = Item::find($d['item_id']);

            $item->update([
                'bottom_unit_qty' => $item->bottom_unit_qty - $bottomUnitQty
            ]);

            return [
                'item_id' => $d['item_id'],
                'per_unit_qty' => $d['per_unit_qty'],
                'unit_id' => $d['unit_id'],
                'price_per_unit' => $d['price_per_unit'],
                'total' => $d['total'],
                'sub_name' => $d['sub_name'],
                'bottom_unit_qty' => $bottomUnitQty,
                'sale_id' => $sales->id,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
        })->toArray();

        ItemSale::insert($sellItems);



        return to_route('trade.index')->with('message', 'berhasil melakukan penjualan');
    }

    function calcChildren($model)
    {
        if ($model->children) {
            return $model->parent_ref_qty * $this->calcChildren($model->children);
        }
        return $model->parent_ref_qty;
    }

    public function historyBuy(Request $request)
    {
        $q = $request->q;
        $page = $request->page;
        $perPage = $request->per_page ?? 10;

        $item_purchases = $this->purchaseService->getAllPaginate($perPage, $q);
        if ($page > $item_purchases->lastPage()) {
            return to_route('trade.history-buy', ['q' => $q]);
        }

        return Inertia::render('Trade/HistoryBuy', ['item_purchases' => $item_purchases, 'q' => $q]);
    }
    public function historySell()
    {
        return Inertia::render('Trade/HistorySell');
    }
}
