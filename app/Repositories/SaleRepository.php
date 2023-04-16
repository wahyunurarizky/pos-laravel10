<?php

namespace App\Repositories;

use App\Models\Sale;

class SaleRepository
{

    public function __construct(protected Sale $sale)
    {
    }

    public function create($data)
    {
        return $this->sale->create($data);
    }
}
