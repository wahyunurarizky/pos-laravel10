<?php

namespace App\Services;

use App\Models\Unit;
use App\Repositories\HistoryBalanceRepository;
use Error;
use Illuminate\Support\Facades\Validator;

class HistoryBalanceService
{
    public function __construct(protected HistoryBalanceRepository $historyBalanceRepository)
    {
    }

    public function getAllPaginate($perPage, $q, $page)
    {

        $validator = Validator::make(['perPage' => $perPage, 'page' => $page, 'q' => $q], [
            'perPage' => 'required|numeric|max:100',
            'page' => 'required|numeric|'
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->historyBalanceRepository->paginate($perPage, $q, $page);
    }
}
