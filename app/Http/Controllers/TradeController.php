<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Services\Item\ItemServiceImplement;
use App\Services\Item\ItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TradeController extends Controller
{
    public function __construct(protected ItemService $itemService)
    {
    }

    public function index(Request $request)
    {
        $q = $request->q;
        $page = $request->page;
        $perPage = $request->per_page ?? 10;

        $items = $this->itemService->getAllPaginate($perPage, $q);

        if ($page > $items->lastPage()) {
            return to_route('trade.index', ['q' => $q]);
        }

        return Inertia::render('Trade/Index', ['items' => $items]);
    }
}
