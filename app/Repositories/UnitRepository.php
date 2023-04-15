<?php

namespace App\Repositories;

use App\Models\Unit;

class UnitRepository
{
    public function __construct(protected Unit $unit)
    {
    }

    public function findAll()
    {
        return $this->unit->all();
    }

    public function create($data)
    {
        return $this->unit->create($data);
    }
    public function findById($id)
    {
        return $this->unit->find($id);
    }
}
