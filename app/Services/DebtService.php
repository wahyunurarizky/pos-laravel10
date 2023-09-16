<?php

namespace App\Services;

use App\Repositories\BalanceRepository;
use App\Repositories\DebterRepository;
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
        protected DebterRepository $debterRepository,
        protected HistoryBalanceRepository $historyBalanceRepository
    ) {
    }

    public function getAllPaginate($perPage, $q, $page, $query = [])
    {
        $validatedData = [
            'perPage' => $perPage,
            'q' => $q,
            'page' => $page,
            'debter_id' => @$query['debter_id'],
        ];
        $validator = Validator::make($validatedData, [
            'perPage' => 'required|numeric|max:100',
            'page' => 'required|numeric|',
            'debter_id' => 'numeric'
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->debtRepository->paginate($perPage, $q, $page, $query);
    }

    public function create($data)
    {
        $validator = Validator::make($data, [
            'debter_id' => 'required|numeric',
            'balance_id' => 'required|numeric',
            'debt_amount' => 'required|numeric',
            'description' => 'nullable|string|max:255'
        ]);

        $validator->stopOnFirstFailure()->validate();

        $balance = $this->balanceRepository->findById($data['balance_id']);
        $debter = $this->debterRepository->findById($data['debter_id']);

        if ($debter->type === 'debt') {
            if (isset($data['is_pay']) && $data['is_pay']) {
                if ($balance->amount < $data['debt_amount']) {
                    throw ValidationException::withMessages([
                        'amount' => 'balance not enough, maks outflow is Rp ' . $balance->amount,
                    ]);
                }

                $updatedBalanceAmount = $balance->amount - $data['debt_amount'];
                $debtAfter = $debter->amount - $data['debt_amount'];
                $message = 'Bayar Hutang';
            } else {
                $updatedBalanceAmount = $balance->amount + $data['debt_amount'];
                $debtAfter = $debter->amount + $data['debt_amount'];
                $message = 'Hutang';
            }
        } else {
            if (isset($data['is_pay']) && $data['is_pay']) {
                $updatedBalanceAmount = $balance->amount + $data['debt_amount'];
                $debtAfter = $debter->amount - $data['debt_amount'];
                $message = 'Bayar Piutang';
            } else {
                if ($balance->amount < $data['debt_amount']) {
                    throw ValidationException::withMessages([
                        'amount' => 'balance not enough, maks outflow is Rp ' . $balance->amount,
                    ]);
                }

                $updatedBalanceAmount = $balance->amount - $data['debt_amount'];
                $debtAfter = $debter->amount + $data['debt_amount'];
                $message = 'Piutang';
            }
        }



        $this->balanceRepository->updateById($balance->id, ['amount' => $updatedBalanceAmount]);
        $this->debterRepository->updateById($debter->id, ['amount' => $debtAfter]);

        $data['debt_before'] = $debter->amount;
        $data['debt_after'] = $debtAfter;

        $createdDebt = $this->debtRepository->create($data);

        $historyBalanceData = [
            'type' => 'debt',
            'transaction_id' => $createdDebt->id,
            'balance_id' => $data['balance_id'],
            'amount' => $data['debt_amount'],
            'amount_before' => $balance->amount,
            'message' => $message,
            'amount_after' => $updatedBalanceAmount,
        ];
        $this->historyBalanceRepository->create($historyBalanceData);
    }
}
