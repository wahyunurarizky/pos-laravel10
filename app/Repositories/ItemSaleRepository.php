<?php

namespace App\Repositories;

// use App\Http\Resources\ItemSaleResource;

use App\Http\Resources\ItemSaleResource;
use App\Models\ItemSale;

class ItemSaleRepository
{

    public function __construct(protected ItemSale $itemSale)
    {
    }

    public function paginate($n, $q)
    {
        $query = $this->itemSale->query();
        // populate item
        $query->with('item');

        // searching
        if ($q) {
            $query->whereHas('item', function ($qu) use ($q) {
                $qu->where('name', 'LIKE', "%$q%");
            });
        }

        $query->with('unit', 'sale');

        $query->orderBy('updated_at', 'desc');


        return ItemSaleResource::collection($query->paginate($n)->withQueryString());
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
