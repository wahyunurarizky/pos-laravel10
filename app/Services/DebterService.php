<?php

namespace App\Services;

use App\Models\Unit;
use App\Repositories\DebterRepository;
use Illuminate\Support\Facades\Validator;

class DebterService
{
    public function __construct(protected DebterRepository $debterRepository)
    {
    }

    public function getAll()
    {
        return $this->debterRepository->findAll();
    }

    public function getAllPaginate($perPage, $q, $page)
    {
        $validator = Validator::make(['perPage' => $perPage, 'q' => $q, 'page' => $page], [
            'perPage' => 'required|numeric|max:100',
            'page' => 'required|numeric|'
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->debterRepository->paginate($perPage, $q, $page);
    }

    public function getById($id)
    {
        return $this->debterRepository->findById($id);
    }

    public function create($data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'amount' => 'nullable|numeric'
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->debterRepository->create($data);
    }
}
