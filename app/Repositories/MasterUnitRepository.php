<?php

namespace App\Repositories;

use App\Models\MasterUnit;

class MasterUnitRepository
{
    public function __construct(protected MasterUnit $masterUnit)
    {
    }

    public function findAll()
    {
        return $this->masterUnit->all();
    }
}
