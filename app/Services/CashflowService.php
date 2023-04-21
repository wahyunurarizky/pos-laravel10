<?php

namespace App\Services;

use App\Repositories\CashflowRepository;
use Error;
use Illuminate\Support\Facades\Validator;

class CashflowService
{
    public function __construct(protected CashflowRepository $cashflowRepository)
    {
    }

    public function getAllPaginate($perPage, $q)
    {

        $validator = Validator::make(['perPage' => $perPage, 'q' => $q], [
            'perPage' => 'required|numeric|max:100',
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->cashflowRepository->paginate($perPage, $q);
    }
}
