<?php

namespace App\Services\Item;

use LaravelEasyRepository\BaseService;

interface ItemService extends BaseService
{

    public function getAllPaginate($perPage, $q);
}
