<?php

namespace App\Services;

use App\Repositories\BalanceRepository;
use App\Repositories\CashflowRepository;
use Error;
use Illuminate\Support\Facades\Validator;

class CashflowService
{
    public function __construct(
        protected CashflowRepository $cashflowRepository,
        protected BalanceRepository $balanceRepository
    ) {
    }

    public function getAllPaginate($perPage, $q)
    {

        $validator = Validator::make(['perPage' => $perPage, 'q' => $q], [
            'perPage' => 'required|numeric|max:100',
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->cashflowRepository->paginate($perPage, $q);
    }

    public function createCashflow($data)
    {
        $validator = Validator::make($data, [
            'description' => 'required|string|max:255',
            'balance_id' => 'required|numeric',
            'type' => 'required|string|in:inflow,outflow',
            'amount' => 'required|numeric'
        ]);

        $validator->stopOnFirstFailure()->validate();

        $balance = $this->balanceRepository->findById($data['balance_id']);

        if ($data['type'] === 'inflow') {
            $updatedBalanceAmount = $balance->amount + $data['amount'];
        } else {
            $updatedBalanceAmount = $balance->amount - $data['amount'];
        }

        $this->balanceRepository->updateById($balance->id, ['amount' => $updatedBalanceAmount]);

        return $this->cashflowRepository->create($data);
    }
}
