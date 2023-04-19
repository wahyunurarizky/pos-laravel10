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

    public function update(Request $request, $id)
    {
        $this->itemService->updateById($id, $request->all());

        return to_route('items.index')->with('message', 'berhasil mengubah data');
    }

    public function destroy(Request $request, $id)
    {
        $this->itemService->deleteById($id);

        return to_route('items.index')->with('message', 'berhasil menghapus data');
    }
}
