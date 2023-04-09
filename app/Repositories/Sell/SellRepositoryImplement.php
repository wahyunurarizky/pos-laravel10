<?php

namespace App\Repositories\Sell;

use LaravelEasyRepository\Implementations\Eloquent;
use App\Models\Sell;

class SellRepositoryImplement extends Eloquent implements SellRepository{

    /**
    * Model class to be used in this repository for the common methods inside Eloquent
    * Don't remove or change $this->model variable name
    * @property Model|mixed $model;
    */
    protected $model;

    public function __construct(Sell $model)
    {
        $this->model = $model;
    }

    // Write something awesome :)
}
