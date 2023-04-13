<?php

use App\Http\Controllers\Api\ApiItemController;
use App\Http\Controllers\Api\ApiSellerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TradeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::get('/', function () {
        return Inertia::render('Home');
    })->name('home');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/trade', [TradeController::class, 'index'])->name('trade.index');

    Route::get('/trade/buy', [TradeController::class, 'buy'])->name('trade.buy');
    Route::post('trade/buy', [TradeController::class, 'createBuy'])->name('trade.buy.store');

    Route::get('/trade/sell', [TradeController::class, 'sell'])->name('trade.sell');
    Route::post('trade/sell', [TradeController::class, 'createSell'])->name('trade.sell.store');

    Route::get('/trade/history-sell', [TradeController::class, 'historySell'])->name('trade.history-sell');
    Route::get('/trade/history-buy', [TradeController::class, 'historyBuy'])->name('trade.history-buy');

    Route::post('/api/items/search', [ApiItemController::class, 'index'])->name('api.items.index');
    Route::post('/api/items/check-unique-name', [ApiItemController::class, 'checkUniqueName'])->name('api.items.check-unique-name');
    Route::post('/api/items/check-available-stock', [ApiItemController::class, 'checkAvailableStock'])->name('api.items.check-available-stock');
    Route::get('/api/items/{id}', [ApiItemController::class, 'show'])->name('api.items.show');

    Route::get('/api/seller', [ApiSellerController::class, 'index'])->name('api.seller.index');
    Route::post('/api/seller', [ApiSellerController::class, 'store'])->name('api.seller.store');
});


require __DIR__ . '/auth.php';
