<?php

namespace App\Services\Purchase;

use App\Models\Item;
use App\Models\Pricing;
use App\Models\Purchase;
use App\Models\Unit;
use LaravelEasyRepository\Service;
use App\Repositories\Purchase\PurchaseRepository;
use App\Rules\ItemNameShouldNotExist;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class PurchaseServiceImplement extends Service implements PurchaseService
{

    /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
    protected $mainRepository;

    public function __construct(PurchaseRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    public function validateNewItems($newItemValidates)
    {
        Validator::make($newItemValidates, [
            '*.name' => ['required', 'max:100', new ItemNameShouldNotExist],
            '*.per_unit_qty' => 'required|numeric',
            '*.price_per_unit' => 'required|numeric',
            '*.master_unit_id' => 'required|numeric',
            '*.sub_name' => 'present|array',
            '*.sub_name.*' => 'string',
            '*.unit_name' => 'required|string',
            '*.total' => 'required',
            '*.units.*.parent_ref_qty' => 'required|numeric|min:0|not_in:0',
            '*.units.*.price' => 'required|numeric',
            '*.units.*.name' => 'required|string',
        ], [
            '*.units.*.parent_ref_qty' => 'input tidak valid',
        ])->validate();
    }
    public function validateOldItems($oldItemBuyValidates)
    {
        Validator::make($oldItemBuyValidates, [
            '*.per_unit_qty' => 'required|numeric',
            '*.item_id' => 'required|numeric',
            '*.price_per_unit' => 'required|numeric',
            '*.total' => 'required',
            '*.unit_id' => 'required|numeric',
            '*.units.*.unit_id' => 'required|numeric',
            '*.units.*.price' => 'required|numeric',
            '*.units.*.unit_name' => 'required|string',
        ])->validate();
    }

    public function insertNewItem($newItemBuys)
    {
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
                'seller_id' => $data['seller_id'],
                'checkout_id' => $data['checkout_id'],
            ]);

            $item->update([
                'bottom_unit_qty' => $bottomUnitQty
            ]);
        }
    }

    public function insertOldItem($oldItemBuys)
    {
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

            $item = Item::find($d['item_id']);

            $item->update([
                'bottom_unit_qty' => $bottomUnitQty + $item->bottom_unit_qty
            ]);

            return [
                'item_id' => $d['item_id'],
                'per_unit_qty' => $d['per_unit_qty'],
                'unit_id' => $d['unit_id'],
                'price_per_unit' => $d['price_per_unit'],
                'total' => $d['total'],
                'seller_id' => $d['seller_id'],
                'bottom_unit_qty' => $bottomUnitQty,
                'bottom_unit_qty_left' => $bottomUnitQty,
                'checkout_id' => $d['checkout_id'],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
        })->toArray());
    }

    function calcChildren($model)
    {
        if ($model->children) {
            return $model->parent_ref_qty * $this->calcChildren($model->children);
        }
        return $model->parent_ref_qty;
    }
}
