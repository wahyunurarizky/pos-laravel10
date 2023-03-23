<?php

namespace App\Repositories\Item;

use Illuminate\Pagination\LengthAwarePaginator;
use LaravelEasyRepository\Repository;

interface ItemRepository extends Repository
{

    public function paginate($n, $q);
    public function findAll(array $where, int $limit, string|null $q);
    public function checkExistBy(array $q): bool;
}
