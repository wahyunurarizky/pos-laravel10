<?php

namespace App\Services\Item;

use LaravelEasyRepository\BaseService;

interface ItemService extends BaseService
{

    public function getAllPaginate($perPage, $q);

    public function getAll(array $whereClause = [], int $limit = 10, string|null $q);
}
