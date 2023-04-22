<?php

namespace App\Repositories;

use App\Http\Resources\HistoryBalanceResource;
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

    public function paginate($n, $q, $page)
    {
        $query = $this->historyBalance->query();

        // searching
        // if ($q) {
        //     $query->where('message', 'LIKE', "%$q%");
        // }

        $query->orderBy('created_at', 'desc');

        // populate bottomUnit
        // $query->with('cashflow');

        return HistoryBalanceResource::collection($query->paginate($n, ['*'], 'page', $page)->withQueryString());
    }

    // public function findAll()
    // {
    //     $query = $this->historyBalance->query();

    //     return $query->get();
    // }

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
