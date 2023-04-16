<?php

namespace App\Services;

use App\Models\Unit;
use App\Repositories\ItemRepository;
use Error;
use Illuminate\Support\Facades\Validator;

class ItemService
{
    public function __construct(protected ItemRepository $itemRepository)
    {
    }

    public function getAllPaginate($perPage, $q)
    {

        $validator = Validator::make(['perPage' => $perPage, 'q' => $q], [
            'perPage' => 'required|numeric|max:100',
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->itemRepository->paginate($perPage, $q);
    }

    public function getAll(array $whereClause = [], int $limit = 10, string|null $q = null)
    {
        $where = [];
        if (isset($whereClause['name'])) $where['name'] = $whereClause['name'];
        if (isset($whereClause['master_unit_id'])) $where['master_unit_id'] = $whereClause['master_unit_id'];

        $validator = Validator::make(
            ['where' => $where, 'limit' => $limit,  'q' => $q],
            [
                'limit' => 'required|numeric',
                'where.name' => 'nullable|string',
                'where.master_unit_id' => 'nullable|numeric',
                'q' => 'nullable|string'
            ]
        );

        if ($validator->fails()) {
            throw new Error($validator->messages(), 400);
        }

        return $this->itemRepository->findAll($where, $limit, $q);
    }
    public function checkNameAlreadyExists($name): bool
    {
        $validator = Validator::make(
            ['name' => $name],
            [
                'name' => 'required|string',
            ]
        );

        if ($validator->fails()) {
            throw new Error($validator->messages(), 400);
        }
        return $this->itemRepository->checkExistBy(['name' => $name]);
    }

    public function findByIdWithPricing(int $id)
    {
        return $this->itemRepository->findById($id, ['units', 'units.pricing', 'units.itemPurchase', 'bottomUnit']);
    }
    public function checkAvailableStock($unit_id, $per_unit_qty)
    {
        $unit = Unit::find($unit_id);
        $per_unit_bottom_qty_calc = $unit->calcQtyBottomUnit($per_unit_qty);

        $bottom_unit_qty = $unit->item->bottom_unit_qty;

        return $per_unit_bottom_qty_calc <= $bottom_unit_qty;
    }
}