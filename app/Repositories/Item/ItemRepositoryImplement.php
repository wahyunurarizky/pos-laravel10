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

    public function findAll(array $where, int $limit, string|null $q)
    {
        $query = $this->model->query();
        // searching
        if ($q) {
            $query->where('name', 'LIKE', "%$q%");
        }

        // populate bottomUnit
        $query->with('bottomUnit');

        if (!empty($where)) {
            $query->where($where);
        }

        if ($limit) {
            $query->limit($limit);
        }

        return ItemResource::collection($query->get());
    }

    public function checkExistBy(array $q): bool
    {
        $query = $this->model->query();
        if (!empty($query)) {
            $query->where($q);
        }

        return $query->exists();
    }
}
