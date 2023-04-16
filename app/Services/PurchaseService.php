<?php

namespace App\Services;

use App\Repositories\ItemPurchaseRepository;
use App\Repositories\ItemRepository;
use App\Repositories\PricingRepository;
use App\Repositories\PurchaseRepository;
use App\Repositories\UnitRepository;
use App\Rules\ItemNameShouldNotExist;
use Illuminate\Support\Facades\Validator;

class PurchaseService
{

    public function __construct(
        protected ItemRepository $itemRepository,
        protected ItemPurchaseRepository $itemPurchaseRepository,
        protected PurchaseRepository $purchaseRepository,
        protected UnitRepository $unitRepository,
        protected PricingRepository $pricingRepository,
        protected ItemNameShouldNotExist $itemNameShouldNotExist
    ) {
    }

    public function buyNewAndOldItems($newItemValidates, $oldItemBuyValidates, $purchaseData, $newItemBuys, $oldItemBuys)
    {
        $this->validateNewItems($newItemValidates);
        $this->validateOldItems($oldItemBuyValidates);

        $purchase = $this->purchaseRepository->create($purchaseData);

        $oldItemBuys = collect($oldItemBuys)->map(function ($item) use ($purchase) {
            $item['purchase_id'] = $purchase->id;
            return $item;
        });
        $newItemBuys = collect($newItemBuys)->map(function ($item) use ($purchase) {
            $item['purchase_id'] = $purchase->id;
            return $item;
        });

        $this->insertNewItem($newItemBuys);
        $this->insertOldItem($oldItemBuys);

        $totalOldItem = collect($oldItemBuys)->reduce(function ($accumulator, $currentValue) {
            return $accumulator + $currentValue['total'];
        }, 0);
        $totalNewItem = collect($newItemBuys)->reduce(function ($accumulator, $currentValue) {
            return $accumulator + $currentValue['total'];
        }, 0);

        $this->purchaseRepository->updateById($purchase->id, ['total' => $totalOldItem + $totalNewItem]);
    }

    private function validateNewItems($newItemValidates)
    {
        Validator::make($newItemValidates, [
            '*.name' => ['required', 'max:100', $this->itemNameShouldNotExist],
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
        ])->stopOnFirstFailure()->validate();
    }
    private function validateOldItems($oldItemBuyValidates)
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
        ])->stopOnFirstFailure()->validate();
    }

    private function insertNewItem($newItemBuys)
    {
        foreach ($newItemBuys as $data) {
            $item = $this->itemRepository->create(
                [
                    'name' => $data['name'],
                    'master_unit_id' => $data['master_unit_id'],
                    'sub_name' => $data['sub_name'],
                ]
            );

            $tempUnit = null;
            $unitPurchase = null;
            foreach ($data['units'] as $unit) {
                $tempUnit = $this->unitRepository->create([
                    'name' => $unit['name'],
                    'parent_id' => $tempUnit ? $tempUnit->id : $tempUnit,
                    'parent_ref_qty' => $unit['parent_ref_qty'],
                    'item_id' => $item->id
                ]);

                if ($data['unit_name'] == $unit['name']) {
                    $unitPurchase = $tempUnit;
                }

                $this->pricingRepository->create([
                    'unit_id' => $tempUnit->id,
                    'price' => $unit['price'],
                ]);
            }

            $bottomUnitQty = $data['per_unit_qty'];
            if ($unitPurchase?->children) {
                $bottomUnitQty = $bottomUnitQty * $this->calcChildren($unitPurchase->children);
            }

            $this->itemPurchaseRepository->create([
                'item_id' => $item->id,
                'unit_id' => $unitPurchase->id,
                'per_unit_qty' => $data['per_unit_qty'],
                'price_per_unit' => $data['price_per_unit'],
                'total' => $data['total'],
                'bottom_unit_qty' => $bottomUnitQty,
                'bottom_unit_qty_left' => $bottomUnitQty,
                'purchase_id' => $data['purchase_id'],
            ]);

            $this->itemRepository->updateById($item->id, [
                'bottom_unit_qty' => $bottomUnitQty
            ]);
        }
    }

    private function insertOldItem($oldItemBuys)
    {
        $items = collect($oldItemBuys)->map(function ($d) {
            $bottomUnitQty = $d['per_unit_qty'];
            $unitPurchase = $this->unitRepository->findById($d['unit_id']);
            if ($unitPurchase->children) {
                $bottomUnitQty = $bottomUnitQty * $this->calcChildren($unitPurchase->children);
            }

            collect($d['units'])->each(function ($unit) {
                $price = $this->pricingRepository->findOne(['unit_id' => $unit['unit_id']]);

                if ($price->price != $unit['price']) {
                    $this->pricingRepository->create([
                        'unit_id' => $unit['unit_id'],
                        'price' => $unit['price'],
                    ]);
                }
            });

            $item = $this->itemRepository->findById($d['item_id']);

            $this->itemRepository->updateById($item->id, [
                'bottom_unit_qty' => $bottomUnitQty + $item->bottom_unit_qty
            ]);

            return [
                'item_id' => $d['item_id'],
                'per_unit_qty' => $d['per_unit_qty'],
                'unit_id' => $d['unit_id'],
                'price_per_unit' => $d['price_per_unit'],
                'total' => $d['total'],
                'bottom_unit_qty' => $bottomUnitQty,
                'bottom_unit_qty_left' => $bottomUnitQty,
                'purchase_id' => $d['purchase_id'],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
        })->toArray();

        $this->itemPurchaseRepository->createBulk($items);
    }

    private function calcChildren($model)
    {
        if ($model->children) {
            return $model->parent_ref_qty * $this->calcChildren($model->children);
        }
        return $model->parent_ref_qty;
    }

    public function getAllItemPurchasePaginate($perPage, $q)
    {

        $validator = Validator::make(['perPage' => $perPage, 'q' => $q], [
            'perPage' => 'required|numeric|max:100',
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->itemPurchaseRepository->paginate($perPage, $q);
    }
}
