<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Repositories\MasterUnitRepository;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Arr;


class PurchaseController extends Controller
{
    public function __construct(protected PurchaseService $purchaseService, protected MasterUnitRepository $masterUnit)
    {
    }

    public function buy()
    {
        $master_units = $this->masterUnit->findAll();
        return Inertia::render('Item/Purchase/Buy', ['master_units' => $master_units]);
    }

    public function saveBuy(Request $request)
    {

        $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric',
            'seller_id' => 'nullable|numeric'
        ]);

        $newItemBuys = [];
        $newItemValidates = [];
        $oldItemBuys = [];
        $oldItemValidates = [];

        foreach ($request->items as $key => $item) {
            if (@$item['isNew']) {
                $data = [
                    'name' => Str::upper(@$item['name']),
                    'master_unit_id' => @$item['master_unit_id'],
                    'sub_name' => @$item['sub_name'],
                    'units' => @$item['units'],
                    'unit_name' => @$item['unit_name'],
                    'per_unit_qty' => @$item['per_unit_qty'],
                    'price_per_unit' => @$item['price_per_unit'],
                    'total' => @$item['total'],
                ];

                $newItemBuys[] = $data;
                $newItemValidates[$key] = [...$data, 'units' => Arr::except($data['units'], [0])];
            } else {
                $data = [
                    'item_id' => @$item['item_id'],
                    'units' => @$item['units'],
                    'unit_id' => @$item['unit_id'],
                    'per_unit_qty' => @$item['per_unit_qty'],
                    'price_per_unit' => @$item['price_per_unit'],
                    'total' => @$item['total'],
                ];

                $oldItemBuys[] = $data;
                $oldItemValidates[$key] = $data;
            }
        }

        $purchaseData = [
            'seller_id' => $request->seller_id
        ];

        $this->purchaseService->buyNewAndOldItems($newItemValidates, $oldItemValidates, $purchaseData, $newItemBuys, $oldItemBuys);

        return to_route('items.index')->with('message', 'berhasil menambahkan data');
    }
}
