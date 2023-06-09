<?php

namespace App\Services;

use App\Repositories\BalanceRepository;
use App\Repositories\CashflowRepository;
use App\Repositories\HistoryBalanceRepository;
use Error;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CashflowService
{
    public function __construct(
        protected CashflowRepository $cashflowRepository,
        protected BalanceRepository $balanceRepository,
        protected HistoryBalanceRepository $historyBalanceRepository
    ) {
    }

    public function getAllPaginate($perPage, $q, $page)
    {
        $validator = Validator::make(['perPage' => $perPage, 'q' => $q, 'page' => $page], [
            'perPage' => 'required|numeric|max:100',
            'page' => 'required|numeric|'
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->cashflowRepository->paginate($perPage, $q, $page);
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

        if ($data['type'] === 'outflow' && $balance->amount < $data['amount']) {
            throw ValidationException::withMessages([
                'amount' => 'balance not enough, maks outflow is Rp ' . $balance->amount,
            ]);
        }

        if ($data['type'] === 'inflow') {
            $updatedBalanceAmount = $balance->amount + $data['amount'];
        } else {
            $updatedBalanceAmount = $balance->amount - $data['amount'];
        }


        $this->balanceRepository->updateById($balance->id, ['amount' => $updatedBalanceAmount]);

        $createdCashflow = $this->cashflowRepository->create($data);

        $historyBalanceData = [
            'type' => 'cashflow',
            'message' => $data['type'] === 'inflow' ? 'Uang masuk' : 'Uang keluar',
            'transaction_id' => $createdCashflow->id,
            'balance_id' => $data['balance_id'],
            'amount' => $data['amount'],
            'amount_before' => $balance->amount,
            'amount_after' => $updatedBalanceAmount,
        ];

        $this->historyBalanceRepository->create($historyBalanceData);
    }

    public function getById($id)
    {
        return $this->cashflowRepository->findById($id);
    }

    public function updateById($id, $data)
    {
        $validator = Validator::make($data, [
            'description' => 'required|string|max:255',
        ]);
        $validator->stopOnFirstFailure()->validate();

        $data = [
            'description' => $data['description']
        ];

        $this->cashflowRepository->updateById($id, $data);
    }
}
