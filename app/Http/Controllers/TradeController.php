<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\MasterUnit;
use App\Models\Pricing;
use App\Models\Purchase;
use App\Models\Unit;
use App\Rules\ItemNameShouldNotExist;
use App\Services\Item\ItemServiceImplement;
use App\Services\Item\ItemService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TradeController extends Controller
{
    public function __construct(protected ItemService $itemService)
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

    public function store(Request $request)
    {
        $data = [
            'name' => $request->name,
            'master_unit_id' => $request->master_unit_id,
            'sub_name' => $request->sub_name,
            'units' => $request->units,
            'unit_name' => $request->unit_name,
            'per_unit_qty' => $request->per_unit_qty,
            'price_per_unit' => $request->price_per_unit,
            'total' => $request->total,
            'seller' => $request->seller
        ];

        $request->validate([
            'name' => ['required', 'max:100', new ItemNameShouldNotExist],
            'per_unit_qty' => 'required|numeric',
            'price_per_unit' => 'required|numeric',
            'master_unit_id' => 'required|numeric',
            'units.*.parent_ref_qty' => 'required|numeric',
            'units.*.price' => 'required|numeric',
            'units.*.name' => 'required|string',
            'sub_name' => 'present|array',
            'sub_name.*' => 'string',
            'unit_name' => 'required|string',
            'total' => 'required',
            'seller' => 'string'
        ]);

        $data['name'] = Str::upper($data['name']);

        $item = Item::create([
            'name' => $data['name'],
            'master_unit_id' => $data['master_unit_id'],
            'sub_name' => $data['sub_name'],
        ]);

        $tempUnit = null;
        $unitPurchase = null;
        foreach ($data['units'] as $unit) {
            $tempUnit = Unit::create([
                'name' => $unit['name'],
                'parent_id' => $tempUnit ? $tempUnit->id : $tempUnit,
                'parent_ref_qty' => $unit['parent_ref_qty'],
                'item_id' => $item->id
            ]);

            if ($data['unit_name'] == $unit['name']) {
                $unitPurchase = $tempUnit;
            }

            Pricing::create([
                'item_id' => $item->id,
                'unit_id' => $tempUnit->id,
                'price' => $unit['price'],
            ]);
        }

        function calcChildren($model)
        {
            if ($model->children) {
                return $model->parent_ref_qty * calcChildren($model->children);
            }
            return $model->parent_ref_qty;
        }

        $bottomUnitQty = $data['per_unit_qty'];
        if ($unitPurchase->children) {
            $bottomUnitQty = $bottomUnitQty * calcChildren($unitPurchase->children);
        }

        Purchase::create([
            'item_id' => $item->id,
            'unit_id' => $unitPurchase->id,
            'per_unit_qty' => $data['per_unit_qty'],
            'price_per_unit' => $data['price_per_unit'],
            'total' => $data['total'],
            'bottom_unit_qty' => $bottomUnitQty,
            'bottom_unit_qty_left' => $bottomUnitQty,
            'seller' => $data['seller'],
        ]);

        $item->update([
            'bottom_unit_qty' => $bottomUnitQty
        ]);
    }
}
