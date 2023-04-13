<?php

namespace App\Repositories\Sale;

use LaravelEasyRepository\Implementations\Eloquent;
use App\Models\Sale;

class SaleRepositoryImplement extends Eloquent implements SaleRepository{

    /**
    * Model class to be used in this repository for the common methods inside Eloquent
    * Don't remove or change $this->model variable name
    * @property Model|mixed $model;
    */
    protected $model;

    public function __construct(Sale $model)
    {
        $this->model = $model;
    }

    // Write something awesome :)
}
