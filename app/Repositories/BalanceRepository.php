<?php

namespace App\Repositories;

use App\Models\Balance;

class BalanceRepository
{

    public function __construct(protected Balance $balance)
    {
    }

    public function create($data)
    {
        return $this->balance->create($data);
    }


    public function findAll()
    {
        $query = $this->balance->query();

        return $query->get();
    }

    public function findById($id)
    {
        return $this->balance->find($id);
    }

    public function updateById($id, $data)
    {
        return $this->balance->where('id', $id)->update($data);
    }

    public function deleteById($id)
    {
        $balance = $this->balance->findOrFail($id);
        return $balance->delete();
    }
}
