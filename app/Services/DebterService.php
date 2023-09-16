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

    public function getAll($query)
    {
        return $this->debterRepository->findAll($query);
    }

    public function getAllPaginate($perPage, $q, $page, $query = [])
    {
        $validator = Validator::make(
            [
                'perPage' => $perPage,
                'q' => $q,
                'page' => $page,
                'type' => @$query['type']
            ],
            [
                'q' => 'nullable|string',
                'perPage' => 'required|numeric|max:100',
                'page' => 'required|numeric',
                'type' => 'nullable|string|in:debt,bond',
            ]
        );

        $validator->stopOnFirstFailure()->validate();

        return $this->debterRepository->paginate($perPage, $q, $page, $query);
    }

    public function getById($id)
    {
        return $this->debterRepository->findById($id);
    }

    public function create($data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:debt,bond',
            'amount' => 'nullable|numeric'
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->debterRepository->create($data);
    }
}
