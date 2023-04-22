<?php

namespace App\Repositories;

use App\Http\Resources\CashflowResource;
use App\Models\Cashflow;

class CashflowRepository
{

    public function __construct(protected Cashflow $cashflow)
    {
    }

    public function create($data)
    {
        return $this->cashflow->create($data);
    }

    public function paginate($n, $q, $page)
    {
        $query = $this->cashflow->query();

        // searching
        if ($q) {
            $query->where('description', 'LIKE', "%$q%");
        }

        $query->orderBy('updated_at', 'desc');

        // populate bottomUnit
        $query->with('balance', 'history');

        return CashflowResource::collection($query->paginate($n, ['*'], 'page', $page)->withQueryString());
    }

    public function findById($id, $with = [])
    {
        $query = $this->cashflow->query();
        $query->with($with);

        return new CashflowResource($query->findOrFail($id));
    }


    public function updateById($id, $data)
    {
        $cashflow = $this->cashflow->findOrFail($id);
        return $cashflow->update($data);
    }

    public function deleteById($id)
    {
        $cashflow = $this->cashflow->findOrFail($id);
        return $cashflow->delete();
    }
}
