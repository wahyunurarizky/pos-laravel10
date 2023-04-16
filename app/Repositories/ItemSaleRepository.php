<?php

namespace App\Repositories;

// use App\Http\Resources\ItemSaleResource;
use App\Models\ItemSale;

class ItemSaleRepository
{

    public function __construct(protected ItemSale $itemSale)
    {
    }

    public function create($data)
    {
        return $this->itemSale->create($data);
    }

    public function createBulk($data)
    {
        return $this->itemSale->insert($data);
    }
}
