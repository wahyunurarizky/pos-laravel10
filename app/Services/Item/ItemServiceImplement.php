<?php

namespace App\Services\Item;

use LaravelEasyRepository\Service;
use App\Repositories\Item\ItemRepository;

class ItemServiceImplement extends Service implements ItemService
{

    /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
    protected $mainRepository;

    public function __construct(ItemRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    public function getAllPaginate($perPage, $q)
    {
        return $this->mainRepository->paginate($perPage, $q);
    }
}
