<?php

namespace App\Repositories\Item;

use App\Http\Resources\ItemResource;
use LaravelEasyRepository\Implementations\Eloquent;
use App\Models\Item;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ItemRepositoryImplement extends Eloquent implements ItemRepository
{

    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     * @property Model|mixed $model;
     */
    protected $model;

    public function __construct(Item $model)
    {
        $this->model = $model;
    }

    public function paginate($n, $q)
    {
        $query = $this->model->query();

        // searching
        if ($q) {
            $query->where('name', 'LIKE', "%$q%");
        }

        // populate bottomUnit
        $query->with('bottomUnit');

        return ItemResource::collection($query->paginate($n)->withQueryString());
    }

    // Write something awesome :)
}
