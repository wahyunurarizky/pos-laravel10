<?php

namespace App\Repositories;

use App\Http\Resources\ItemResource;
use App\Models\Item;

class ItemRepository
{

    public function __construct(protected Item $item)
    {
    }

    public function create($data)
    {
        return $this->item->create($data);
    }

    public function paginate($n, $q, $page)
    {
        $query = $this->item->query();

        // searching
        if ($q) {
            $query->where('name', 'LIKE', "%$q%");
        }

        $query->orderBy('updated_at', 'desc');

        // populate bottomUnit
        $query->with('bottomUnit');


        return ItemResource::collection($query->paginate($n, ['*'], 'page', $page)->withQueryString());
    }

    public function findAll(array $where, int $limit, string|null $q)
    {
        $query = $this->item->query();
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

        $query->orderBy('updated_at', 'desc');

        return ItemResource::collection($query->get());
    }

    public function checkExistBy(array $q): bool
    {
        $query = $this->item->query();
        if (!empty($query)) {
            $query->where($q);
        }

        return $query->exists();
    }

    public function findById($id, $with = ['units', 'units.pricing', 'units.itemPurchase'])
    {
        $query = $this->item->query();
        $query->with($with);

        return new ItemResource($query->findOrFail($id));
    }


    public function updateById($id, $data)
    {
        $item = $this->item->findOrFail($id);
        return $item->update($data);
    }

    public function deleteById($id)
    {
        $item = $this->item->findOrFail($id);
        return $item->delete();
    }
}
