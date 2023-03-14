<?php

namespace App\Repositories\Item;

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

    public function paginate($n, $q): LengthAwarePaginator
    {
        $query = $this->model->query();
        if ($q) {
            $query->where('name', 'LIKE', "%$q%");
        }
        $itemPaginate = $query->paginate($n);
        $itemPaginate->appends(['q' => $q]);
        return $itemPaginate;
    }

    // Write something awesome :)
}
