<?php

namespace App\Services;

use App\Models\Unit;
use App\Repositories\BalanceRepository;

class BalanceService
{
    public function __construct(protected BalanceRepository $balanceRepository)
    {
    }

    public function getAllBalance()
    {
        return $this->balanceRepository->findAll();
    }

    public function getById($id)
    {
        return $this->balanceRepository->findById($id);
    }
}
