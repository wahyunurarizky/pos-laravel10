<?php

namespace App\Http\Controllers;

use App\Repositories\MasterUnitRepository;
use App\Services\BalanceService;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;


class PurchaseController extends Controller
{
    public function __construct(
        protected PurchaseService $purchaseService,
        protected BalanceService $balanceService,
        protected MasterUnitRepository $masterUnitRepository
    ) {
    }

    public function buy()
    {
        $balances = $this->balanceService->getAllBalance();
        $master_units = $this->masterUnitRepository->findAll();
        return Inertia::render('Item/Purchase/Buy', [
            'master_units' => $master_units,
            'balances' => $balances
        ]);
    }

    public function saveBuy(Request $request)
    {

        $this->purchaseService->buyNewAndOldItems($request->all());

        return to_route('items.index')->with('message', 'berhasil menambahkan data');
    }

    public function historyBuy(Request $request)
    {
        $q = $request->q;
        $page = $request->page;
        $perPage = $request->per_page ?? 10;

        $item_purchases = $this->purchaseService->getAllItemPurchasePaginate($perPage, $q);
        if ($page > $item_purchases->lastPage()) {
            return to_route('items.history-buy', ['q' => $q]);
        }

        return Inertia::render('Item/Purchase/History', ['item_purchases' => $item_purchases, 'q' => $q]);
    }
}
