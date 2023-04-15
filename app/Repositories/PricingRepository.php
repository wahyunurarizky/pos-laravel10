<?php

namespace App\Repositories;

use App\Models\Pricing;

class PricingRepository
{
    public function __construct(protected Pricing $pricing)
    {
    }

    public function findAll()
    {
        return $this->pricing->all();
    }

    public function create($data)
    {
        return $this->pricing->create($data);
    }

    public function findOne($data, $sort = 'created_at', $sortType = "desc")
    {
        $q = $this->pricing->query();

        $q->where($data);
        $q->orderBy($sort, $sortType);

        return $q->first();
    }
}
