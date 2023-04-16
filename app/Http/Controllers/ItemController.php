<?php

namespace App\Http\Controllers;

use App\Services\ItemService;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function __construct(protected ItemService $itemService, protected PurchaseService $purchaseService)
    {
    }

    public function index(Request $request)
    {
        $q = $request->q;
        $page = $request->page;
        $perPage = $request->per_page ?? 10;

        $items = $this->itemService->getAllPaginate($perPage, $q);

        if ($page > $items->lastPage()) {
            return to_route('items.index', ['q' => $q]);
        }

        return Inertia::render('Item/Items', ['items' => $items, 'q' => $q]);
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

    public function historySell()
    {
        return Inertia::render('Item/Sale/History');
    }
}
