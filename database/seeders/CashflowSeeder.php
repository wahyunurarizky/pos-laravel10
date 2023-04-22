<?php

namespace Database\Seeders;

use App\Models\Cashflow;
use App\Models\HistoryBalance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CashflowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cashflowInit = Cashflow::create([
            'amount' => 2000000,
            'description' => 'Initial cash',
            'type' => 'inflow',
            'balance_id' => 1
        ]);

        HistoryBalance::create([
            'message' => 'uang masuk',
            'transaction_id' => $cashflowInit->id,
            'type' => 'cashflow',
            'amount' => $cashflowInit->amount,
            'amount_before' => 0,
            'amount_after' => $cashflowInit->amount,
            'balance_id' => 1
        ]);
    }
}
