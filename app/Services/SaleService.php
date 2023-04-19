<?php

namespace App\Services;

use App\Repositories\ItemSaleRepository;
use App\Repositories\ItemRepository;
use App\Repositories\PricingRepository;
use App\Repositories\PurchaseRepository;
use App\Repositories\SaleRepository;
use App\Repositories\UnitRepository;
use App\Rules\ItemNameShouldNotExist;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SaleService
{

    public function __construct(
        protected ItemRepository $itemRepository,
        protected ItemSaleRepository $itemSaleRepository,
        protected UnitRepository $unitRepository,
        protected PricingRepository $pricingRepository,
        protected SaleRepository $saleRepository,
        protected ItemService $itemService
    ) {
    }

    public function sellItems($items)
    {
        Validator::make($items, [
            '*.per_unit_qty' => 'required|numeric',
            '*.item_id' => 'required|numeric',
            '*.price_per_unit' => 'required|numeric',
            '*.total' => 'required',
            '*.unit_id' => 'required|numeric',
        ])->stopOnFirstFailure()->validate();

        // TODO using validation
        collect($items)->each(function ($d, $i) {
            $available = $this->itemService->checkAvailableStock($d['unit_id'], $d['per_unit_qty']);
            if (!$available) {
                throw ValidationException::withMessages([
                    'stock' => "stock $i not available",
                ]);
            }
        });

        $total = collect($items)->reduce(function ($accumulator, $currentValue) {
            return $accumulator + $currentValue['total'];
        }, 0);

        $sales = $this->saleRepository->create([
            'total' => $total,
        ]);


        $items = collect($items)->map(function ($d) use ($sales) {
            $bottomUnitQty = $d['per_unit_qty'];

            $unitPurchase = $this->unitRepository->findById($d['unit_id']);

            if ($unitPurchase->children) {
                $bottomUnitQty = $bottomUnitQty * $this->calcChildren($unitPurchase->children);
            }

            $pricing = $this->pricingRepository->firstOrCreate(['unit_id' => $d['unit_id']]);

            if (floatval($pricing->price) != floatval($d['price_per_unit']))
                $this->pricingRepository->updateById($pricing->id, ['price' => $d['price_per_unit']]);

            $item = $this->itemRepository->findById($d['item_id']);

            $this->itemRepository->updateById($item->id, [
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

        $this->itemSaleRepository->createBulk($items);
    }

    function calcChildren($model)
    {
        if ($model->children) {
            return $model->parent_ref_qty * $this->calcChildren($model->children);
        }
        return $model->parent_ref_qty;
    }

    public function getAllItemSalePaginate($perPage, $q)
    {

        $validator = Validator::make(['perPage' => $perPage, 'q' => $q], [
            'perPage' => 'required|numeric|max:100',
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->itemSaleRepository->paginate($perPage, $q);
    }
}
