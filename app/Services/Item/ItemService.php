<?php

namespace App\Services\Item;

use LaravelEasyRepository\BaseService;

interface ItemService extends BaseService
{

    public function getAllPaginate($perPage, $q);

    public function getAll(array $whereClause = [], int $limit = 10, string|null $q = null);

    public function checkNameAlreadyExists(string $name): bool;

    public function findByIdWithPricing(int $id);

    public function checkAvailableStock($unit_id, $per_unit_qty);
}
