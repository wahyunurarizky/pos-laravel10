<?php

namespace App\Services\Item;

use LaravelEasyRepository\Service;
use App\Repositories\Item\ItemRepository;
use Error;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class ItemServiceImplement extends Service implements ItemService
{

    /**
     * don't change $this->itemRepository variable name
     * because used in extends service class
     */
    protected $itemRepository;

    public function __construct(ItemRepository $itemRepository)
    {
        $this->itemRepository = $itemRepository;
    }

    public function getAllPaginate($perPage, $q)
    {
        $validator = Validator::make(['perPage' => $perPage, 'q' => $q], [
            'perPage' => 'required|numeric|max:100',
        ]);

        $validator->validate();

        return $this->itemRepository->paginate($perPage, $q);
    }

    public function getAll(array $whereClause = [], int $limit = 10, string|null $q)
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
}
