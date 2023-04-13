<?php

namespace App\Services\Sale;

use LaravelEasyRepository\Service;
use App\Repositories\Sale\SaleRepository;

class SaleServiceImplement extends Service implements SaleService{

     /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
     protected $mainRepository;

    public function __construct(SaleRepository $mainRepository)
    {
      $this->mainRepository = $mainRepository;
    }

    // Define your custom methods :)
}
