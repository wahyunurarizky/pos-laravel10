<?php

use App\Http\Controllers\Api\ApiBalanceController;
use App\Http\Controllers\Api\ApiCashflowController;
use App\Http\Controllers\Api\ApiDebtController;
use App\Http\Controllers\Api\ApiDebterController;
use App\Http\Controllers\Api\ApiHistoryBalanceController;
use App\Http\Controllers\Api\ApiItemController;
use App\Http\Controllers\Api\ApiSellerController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\BondController;
use App\Http\Controllers\CashflowController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'home'])->name('home');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/items', [ItemController::class, 'index'])->name('items.index');
    Route::put('/items/{id}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{id}', [ItemController::class, 'destroy'])->name('items.destroy');

    Route::get('/items/buy', [PurchaseController::class, 'buy'])->name('items.buy');
    Route::post('/items/buy', [PurchaseController::class, 'saveBuy'])->name('items.buy.save');

    Route::get('/items/sell', [SaleController::class, 'sell'])->name('items.sell');
    Route::post('/items/sell', [SaleController::class, 'saveSell'])->name('items.sell.save');

    Route::get('/items/history-sell', [SaleController::class, 'historySell'])->name('items.history-sell');
    Route::get('/items/history-buy', [PurchaseController::class, 'historyBuy'])->name('items.history-buy');

    Route::get('/balances/{id}', [BalanceController::class, 'show'])->name('balances.show');

    Route::get('/cashflows', [CashflowController::class, 'index'])->name('cashflows.index');
    Route::post('/cashflows', [CashflowController::class, 'store'])->name('cashflows.store');
    Route::put('/cashflows/{id}', [CashflowController::class, 'update'])->name('cashflows.update');

    Route::get('/debt-bond', [HomeController::class, 'debtBond'])->name('debt-bond.index');

    Route::get('/debters', [DebtController::class, 'debters'])->name('debters.index');
    Route::post('/debters', [DebtController::class, 'store'])->name('debters.store');
    Route::get('/debters/{id}/debts', [DebtController::class, 'debts'])->name('debters.show.debts');

    Route::get('/bonders', [BondController::class, 'bonders'])->name('bonders.index');
    Route::post('/bonders', [BondController::class, 'store'])->name('bonders.store');
    Route::get('/bonders/{id}/bonds', [BondController::class, 'bonds'])->name('bonders.show.bonds');

    // API

    // API ITEMS
    Route::post('/api/items/search', [ApiItemController::class, 'index'])->name('api.items.index');
    Route::post('/api/items/check-unique-name', [ApiItemController::class, 'checkUniqueName'])->name('api.items.check-unique-name');
    Route::post('/api/items/check-available-stock', [ApiItemController::class, 'checkAvailableStock'])->name('api.items.check-available-stock');
    Route::get('/api/items/{id}', [ApiItemController::class, 'show'])->name('api.items.show');

    // API SELLERS
    Route::get('/api/sellers', [ApiSellerController::class, 'index'])->name('api.sellers.index');
    Route::post('/api/sellers', [ApiSellerController::class, 'store'])->name('api.sellers.store');

    // API DEBTERS
    Route::get('/api/debters', [ApiDebterController::class, 'index'])->name('api.debters.index');
    Route::get('/api/debters/{id}', [ApiDebterController::class, 'show'])->name('api.debters.show');
    Route::post('/api/debters', [ApiDebterController::class, 'store'])->name('api.debters.store');

    // API DEBTS
    Route::get('/api/debts', [ApiDebtController::class, 'index'])->name('api.debts.index');

    // API CASHFLOWS
    Route::get('/api/cashflows/{id}', [ApiCashflowController::class, 'show'])->name('api.cashflows.show');

    // API BALANCES
    Route::get('/api/balances', [ApiBalanceController::class, 'index'])->name('api.balances.index');

    // API HISTORY BALANCES
    Route::get('/api/history-balances/{id}', [ApiHistoryBalanceController::class, 'show'])->name('api.historybalances.show');
});


require __DIR__ . '/auth.php';
