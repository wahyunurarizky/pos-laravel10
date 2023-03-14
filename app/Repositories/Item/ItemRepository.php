<?php

namespace App\Repositories\Item;

use Illuminate\Pagination\LengthAwarePaginator;
use LaravelEasyRepository\Repository;

interface ItemRepository extends Repository
{

    public function paginate($n, $q): LengthAwarePaginator;
}
