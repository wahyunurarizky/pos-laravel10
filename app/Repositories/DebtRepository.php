<?php

namespace App\Repositories;

use App\Http\Resources\DebtResource;
use App\Models\Debt;

class DebtRepository
{

    public function __construct(protected Debt $debt)
    {
    }

    public function create($data)
    {
        return $this->debt->create($data);
    }

    public function paginate($n, $q, $page, $where)
    {
        $query = $this->debt->query();

        // searching
        if ($q) {
            $query->where('debter', 'LIKE', "%$q%");
        }

        if ($where) {
            $query->where($where);
        }

        $query->orderBy('updated_at', 'desc');

        // populate bottomUnit
        $query->with('balance', 'debter');

        return DebtResource::collection($query->paginate($n, ['*'], 'page', $page)->withQueryString());
    }
}
