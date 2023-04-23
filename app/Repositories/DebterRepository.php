<?php

namespace App\Repositories;

use App\Http\Resources\DebterResource;
use App\Models\Debter;

class DebterRepository
{

    public function __construct(protected Debter $debter)
    {
    }

    public function paginate($n, $q, $page)
    {
        $query = $this->debter->query();

        // searching
        if ($q) {
            $query->where('name', 'LIKE', "%$q%");
        }

        $query->orderBy('updated_at', 'desc');

        // populate bottomUnit
        $query->with('debts');

        return DebterResource::collection($query->paginate($n, ['*'], 'page', $page)->withQueryString());
    }

    public function create($data)
    {
        return $this->debter->create($data);
    }


    public function findAll()
    {
        $query = $this->debter->query();

        return $query->get();
    }

    public function findById($id)
    {
        return $this->debter->find($id);
    }

    public function updateById($id, $data)
    {
        return $this->debter->where('id', $id)->update($data);
    }

    public function deleteById($id)
    {
        $debter = $this->debter->findOrFail($id);
        return $debter->delete();
    }
}
