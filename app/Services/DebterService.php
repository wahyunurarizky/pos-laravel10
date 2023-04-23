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

    public function getById($id)
    {
        return $this->debterRepository->findById($id);
    }

    public function create($data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
        ]);

        $validator->stopOnFirstFailure()->validate();

        return $this->debterRepository->create($data);
    }
}
