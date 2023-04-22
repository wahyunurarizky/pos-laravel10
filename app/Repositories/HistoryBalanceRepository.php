<?php

namespace App\Repositories;

use App\Models\HistoryBalance;

class HistoryBalanceRepository
{

    public function __construct(protected HistoryBalance $historyBalance)
    {
    }

    public function create($data)
    {
        return $this->historyBalance->create($data);
    }


    public function findAll()
    {
        $query = $this->historyBalance->query();

        return $query->get();
    }

    public function findById($id)
    {
        return $this->historyBalance->find($id);
    }

    public function updateById($id, $data)
    {
        return $this->historyBalance->where('id', $id)->update($data);
    }

    public function deleteById($id)
    {
        $historyBalance = $this->historyBalance->findOrFail($id);
        return $historyBalance->delete();
    }
}
