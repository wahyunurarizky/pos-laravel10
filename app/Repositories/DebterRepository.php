<?php

namespace App\Repositories;

use App\Models\Debter;

class DebterRepository
{

    public function __construct(protected Debter $debter)
    {
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
