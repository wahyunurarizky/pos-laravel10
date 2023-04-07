<?php

namespace App\Repositories\Purchase;

use LaravelEasyRepository\Implementations\Eloquent;
use App\Models\Purchase;

class PurchaseRepositoryImplement extends Eloquent implements PurchaseRepository{

    /**
    * Model class to be used in this repository for the common methods inside Eloquent
    * Don't remove or change $this->model variable name
    * @property Model|mixed $model;
    */
    protected $model;

    public function __construct(Purchase $model)
    {
        $this->model = $model;
    }

    // Write something awesome :)
}
