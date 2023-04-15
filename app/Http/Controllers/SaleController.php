<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemSale;
use App\Models\Pricing;
use App\Models\Sale;
use App\Models\Unit;
use App\Services\ItemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SaleController extends Controller
{
    function __construct(protected ItemService $itemService)
    {
    }

    public function sell()
    {
        return Inertia::render('Trade/Sell');
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



        return to_route('items.index')->with('message', 'berhasil melakukan penjualan');
    }

    function calcChildren($model)
    {
        if ($model->children) {
            return $model->parent_ref_qty * $this->calcChildren($model->children);
        }
        return $model->parent_ref_qty;
    }
}
