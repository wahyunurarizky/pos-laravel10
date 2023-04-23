<?php

namespace App\Services;

use App\Repositories\BalanceRepository;
use App\Repositories\DebtRepository;
use App\Repositories\HistoryBalanceRepository;
use Error;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class DebtService
{
    public function __construct(
        protected DebtRepository $debtRepository,
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

        return $this->debtRepository->paginate($perPage, $q, $page);
    }

    public function create($data)
    {
        $validator = Validator::make($data, [
            'debter_id' => 'required|numeric',
            'balance_id' => 'required|numeric',
            'type' => 'required|string|in:debt,outdebt',
            'amount' => 'required|numeric'
        ]);

        $validator->stopOnFirstFailure()->validate();

        $balance = $this->balanceRepository->findById($data['balance_id']);

        if ($data['type'] === 'outdebt' && ($balance->amount < $data['amount'])) {
            throw ValidationException::withMessages([
                'amount' => 'balance not enough, maks outdebt is Rp ' . $balance->amount,
            ]);
        }

        if ($data['type'] === 'debt') {
            $updatedBalanceAmount = $balance->amount + $data['amount'];
        } else {
            $updatedBalanceAmount = $balance->amount - $data['amount'];
        }

        $this->balanceRepository->updateById($balance->id, ['amount' => $updatedBalanceAmount]);

        $createdDebt = $this->debtRepository->create($data);

        $historyBalanceData = [
            'type' => 'debt',
            'message' => $data['type'] === 'debt' ? 'Hutang' : 'Piutang',
            'transaction_id' => $createdDebt->id,
            'balance_id' => $data['balance_id'],
            'amount' => $data['amount'],
            'amount_before' => $balance->amount,
            'amount_after' => $updatedBalanceAmount,
        ];
        $this->historyBalanceRepository->create($historyBalanceData);
    }
}
