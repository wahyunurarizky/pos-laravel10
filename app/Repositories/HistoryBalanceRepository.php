<?php

namespace App\Repositories;

use App\Http\Resources\HistoryBalanceResource;
use App\Models\Cashflow;
use App\Models\HistoryBalance;

class HistoryBalanceRepository
{

    public function __construct(protected HistoryBalance $historyBalance, protected Cashflow $cashflow)
    {
    }

    public function create($data)
    {
        return $this->historyBalance->create($data);
    }

    public function paginate($n, $q, $page, $where = [])
    {
        $query = $this->historyBalance->query();

        // searching
        // if ($q) {
        //     $query->where('message', 'LIKE', "%$q%");
        // }

        $query->where($where);

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
        $historyBalance = $this->historyBalance->find($id);
        $data = [];
        if ($historyBalance->type === 'cashflow') {
            // $historyBalance->set('')al
            $data = $this->cashflow->find($historyBalance->transaction_id);
        }
        return [...$historyBalance->toArray(), 'data' => $data];
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
