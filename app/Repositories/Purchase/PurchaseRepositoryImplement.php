<?php

namespace App\Repositories\Purchase;

use App\Http\Resources\ItemPurchaseResource;
use App\Models\Item;
use App\Models\ItemPurchase;
use LaravelEasyRepository\Implementations\Eloquent;

class PurchaseRepositoryImplement extends Eloquent implements PurchaseRepository
{

    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     * @property Model|mixed $itemPurchase;
     */
    protected $itemPurchase;

    public function __construct(Item $item, ItemPurchase $itemPurchase)
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

        $query->with('seller', 'unit');

        $query->orderBy('updated_at', 'desc');


        return ItemPurchaseResource::collection($query->paginate($n)->withQueryString());
    }
}
