<?php

namespace App\Services\Sell;

use LaravelEasyRepository\Service;
use App\Repositories\Sell\SellRepository;

class SellServiceImplement extends Service implements SellService{

     /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
     protected $mainRepository;

    public function __construct(SellRepository $mainRepository)
    {
      $this->mainRepository = $mainRepository;
    }

    // Define your custom methods :)
}
