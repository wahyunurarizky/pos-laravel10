<?php

namespace App\Repositories\Purchase;

use LaravelEasyRepository\Repository;

interface PurchaseRepository extends Repository
{

    public function paginate($n, $q);
}
