<?php

namespace App\Repositories;

use App\Http\Resources\ItemPurchaseResource;
use App\Models\ItemPurchase;

class ItemPurchaseRepository
{

    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     * @property Model|mixed $itemPurchase;
     */
    protected $itemPurchase;

    public function __construct(ItemPurchase $itemPurchase)
    {
        $this->itemPurchase = $itemPurchase;
    }

    public function paginate($n, $q)
    {
        $query = $this->itemPurchase->query();
        // populate item
        $query->with('item');

        // searching
        if ($q) {
            $query->whereHas('item', function ($qu) use ($q) {
                $qu->where('name', 'LIKE', "%$q%");
            });
        }

        $query->with('unit', 'purchase', 'purchase.seller');

        $query->orderBy('updated_at', 'desc');


        return ItemPurchaseResource::collection($query->paginate($n)->withQueryString());
    }

    public function create($data)
    {
        return $this->itemPurchase->create($data);
    }

    public function createBulk($data)
    {
        return $this->itemPurchase->insert($data);
    }

    public function updateById($id, $data)
    {
        $itemPurchase = $this->itemPurchase->findOrFail($id);
        return $itemPurchase->update($data);
    }

    public function findOne($data, $sort = 'created_at', $sortType = 'asc')
    {
        $query = $this->itemPurchase->query();

        $query->where($data);

        $query->orderBy($sort, $sortType);

        return $query->first();
    }
}
