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
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
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
        $request->validate([
            'items' => 'required|array'
        ]);

        $newItemBuys = [];
        $newItemValidates = [];

        $oldItemBuys = [];
        $oldItemBuyValidates = [];

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
                    'seller' => @$item['seller']
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
                    'seller' => @$item['seller']
                ];

                $oldItemBuys[] = $data;
                $oldItemBuyValidates[$key] = $data;
            }
        }
        Validator::make($newItemValidates, [
            '*.name' => ['required', 'max:100', new ItemNameShouldNotExist],
            '*.per_unit_qty' => 'required|numeric',
            '*.price_per_unit' => 'required|numeric',
            '*.master_unit_id' => 'required|numeric',
            '*.sub_name' => 'present|array',
            '*.sub_name.*' => 'string',
            '*.unit_name' => 'required|string',
            '*.total' => 'required',
            '*.seller' => 'string|nullable',
            '*.units.*.parent_ref_qty' => 'required|numeric|min:0|not_in:0',
            '*.units.*.price' => 'required|numeric',
            '*.units.*.name' => 'required|string',
        ], [
            '*.units.*.parent_ref_qty' => 'input tidak valid',
        ])->validate();
        Validator::make($oldItemBuyValidates, [
            '*.per_unit_qty' => 'required|numeric',
            '*.item_id' => 'required|numeric',
            '*.price_per_unit' => 'required|numeric',
            '*.total' => 'required',
            '*.unit_id' => 'required|numeric',
            '*.seller' => 'string|nullable',
            '*.units.*.unit_id' => 'required|numeric',
            '*.units.*.price' => 'required|numeric',
            '*.units.*.unit_name' => 'required|string',
        ])->validate();

        Purchase::insert(collect($oldItemBuys)->map(function ($d) {
            $bottomUnitQty = $d['per_unit_qty'];
            $unitPurchase = Unit::find($d['unit_id']);
            if ($unitPurchase->children) {
                $bottomUnitQty = $bottomUnitQty * $this->calcChildren($unitPurchase->children);
            }

            collect($d['units'])->each(function ($unit) {
                $price = Pricing::where('unit_id', $unit['unit_id'])->latest('created_at')->first();

                if ($price->price != $unit['price']) {
                    Pricing::create([
                        'unit_id' => $unit['unit_id'],
                        'price' => $unit['price'],
                    ]);
                }
            });


            return [
                'item_id' => $d['item_id'],
                'per_unit_qty' => $d['per_unit_qty'],
                'unit_id' => $d['unit_id'],
                'price_per_unit' => $d['price_per_unit'],
                'total' => $d['total'],
                'seller' => $d['seller'],
                'bottom_unit_qty' => $bottomUnitQty,
                'bottom_unit_qty_left' => $bottomUnitQty,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            // TODO: pricing not yet implemented
        })->toArray());

        foreach ($newItemBuys as $data) {
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
                    'unit_id' => $tempUnit->id,
                    'price' => $unit['price'],
                ]);
            }

            $bottomUnitQty = $data['per_unit_qty'];
            if ($unitPurchase->children) {
                $bottomUnitQty = $bottomUnitQty * $this->calcChildren($unitPurchase->children);
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




        return to_route('trade.index')->with('message', 'berhasil menambahkan data');
    }

    function calcChildren($model)
    {
        if ($model->children) {
            return $model->parent_ref_qty * $this->calcChildren($model->children);
        }
        return $model->parent_ref_qty;
    }
}
