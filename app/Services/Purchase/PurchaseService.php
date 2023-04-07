<?php

namespace App\Services\Purchase;

use LaravelEasyRepository\BaseService;

interface PurchaseService extends BaseService
{
    public function validateOldItems($oldItemBuyValidates);
    public function validateNewItems($newItemBuyValidates);

    public function insertOldItem($oldItemBuys);
    public function insertNewItem($newItemBuys);
}
