<?php

namespace App\Services;

use App\Repositories\BalanceRepository;
use App\Repositories\HistoryBalanceRepository;
use App\Repositories\ItemPurchaseRepository;
use App\Repositories\ItemRepository;
use App\Repositories\PricingRepository;
use App\Repositories\PurchaseRepository;
use App\Repositories\UnitRepository;
use App\Rules\ItemNameShouldNotExist;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PurchaseService
{

    public function __construct(
        protected ItemRepository $itemRepository,
        protected ItemPurchaseRepository $itemPurchaseRepository,
        protected PurchaseRepository $purchaseRepository,
        protected UnitRepository $unitRepository,
        protected PricingRepository $pricingRepository,
        protected BalanceRepository $balanceRepository,
        protected HistoryBalanceRepository $historyBalanceRepository,
        protected ItemNameShouldNotExist $itemNameShouldNotExist
    ) {
    }

    public function buyNewAndOldItems($dataPurchase)
    {
        $this->validatePurchase($dataPurchase);

        $newItemBuys = [];
        $newItemValidates = [];
        $oldItemBuys = [];
        $oldItemValidates = [];

        foreach (@$dataPurchase['items'] as $key => $item) {
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
                ];

                $oldItemBuys[] = $data;
                $oldItemValidates[$key] = $data;
            }
        }

        $totalOldItem = collect($oldItemBuys)->reduce(function ($accumulator, $currentValue) {
            return $accumulator + $currentValue['total'];
        }, 0);
        $totalNewItem = collect($newItemBuys)->reduce(function ($accumulator, $currentValue) {
            return $accumulator + $currentValue['total'];
        }, 0);

        $total =  $totalOldItem + $totalNewItem;
        $balance = $this->balanceRepository->findById($dataPurchase['balance_id']);

        if ($total > $balance->amount) {
            throw ValidationException::withMessages([
                'total' => 'balance not enough, maks buy is Rp ' . $balance->amount,
            ]);
        }

        $purchaseData = [
            'seller_id' => @$dataPurchase['seller_id'],
            'balance_id' => @$dataPurchase['balance_id'] ?? 1
        ];

        $this->validateNewItems($newItemValidates);
        $this->validateOldItems($oldItemValidates);

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

        $this->purchaseRepository->updateById($purchase->id, ['total' => $total]);

        $this->balanceRepository->updateById($dataPurchase['balance_id'], ['amount' => $balance->amount - $total]);

        $dataHistoryBalance = [
            'message' => 'pembelian',
            'amount' => $total,
            'balance_id' => $dataPurchase['balance_id'],
            'amount_before' => $balance->amount,
            'amount_before' => $balance->amount - $total,
            'type' => 'purchase',
            'transaction_id' => $purchase->id
        ];
        $this->historyBalanceRepository->create($dataHistoryBalance);
    }

    private function validatePurchase($data)
    {
        Validator::make(
            $data,
            [
                'items' => 'required|array',
                'total' => 'required|numeric',
                'seller_id' => 'nullable|numeric',
                'balance_id' => 'nullable|numeric'
            ]
        )->stopOnFirstFailure()->validate();
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

            $parent_qty_total = 1;


            if ($unitPurchase?->children) {
                $parent_qty_total = $this->calcChildren($unitPurchase->children);
                $bottomUnitQty = $bottomUnitQty * $parent_qty_total;
            }

            $pricePerBottomUnit =  $data['price_per_unit'] / $parent_qty_total;

            $this->itemPurchaseRepository->create([
                'item_id' => $item->id,
                'unit_id' => $unitPurchase->id,
                'per_unit_qty' => $data['per_unit_qty'],
                'price_per_unit' => $data['price_per_unit'],
                'total' => $data['total'],
                'bottom_unit_qty' => $bottomUnitQty,
                'price_per_bottom_unit' => $pricePerBottomUnit,
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
        $items = collect($oldItemBuys)->map(function ($data) {
            $bottomUnitQty = $data['per_unit_qty'];
            $unitPurchase = $this->unitRepository->findById($data['unit_id']);

            $parent_qty_total = 1;

            if ($unitPurchase->children) {
                $parent_qty_total = $this->calcChildren($unitPurchase->children);
                $bottomUnitQty = $bottomUnitQty * $parent_qty_total;
            }

            collect($data['units'])->each(function ($unit) {
                $price = $this->pricingRepository->findOne(['unit_id' => $unit['unit_id']]);

                if ($price->price != $unit['price']) {
                    $this->pricingRepository->create([
                        'unit_id' => $unit['unit_id'],
                        'price' => $unit['price'],
                    ]);
                }
            });

            $item = $this->itemRepository->findById($data['item_id']);

            $this->itemRepository->updateById($item->id, [
                'bottom_unit_qty' => $bottomUnitQty + $item->bottom_unit_qty
            ]);

            $pricePerBottomUnit =  $data['price_per_unit'] / $parent_qty_total;

            return [
                'item_id' => $data['item_id'],
                'per_unit_qty' => $data['per_unit_qty'],
                'unit_id' => $data['unit_id'],
                'price_per_unit' => $data['price_per_unit'],
                'total' => $data['total'],
                'bottom_unit_qty' => $bottomUnitQty,
                'bottom_unit_qty_left' => $bottomUnitQty,
                'price_per_bottom_unit' => $pricePerBottomUnit,
                'purchase_id' => $data['purchase_id'],
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
