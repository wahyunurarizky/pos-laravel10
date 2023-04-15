<?php

namespace App\Repositories;

use App\Models\Purchase;

class PurchaseRepository
{

    public function __construct(protected Purchase $purchase)
    {
    }

    public function create($data)
    {
        return $this->purchase->create($data);
    }
}
