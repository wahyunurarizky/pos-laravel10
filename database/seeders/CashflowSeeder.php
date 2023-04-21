<?php

namespace Database\Seeders;

use App\Models\Cashflow;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CashflowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cashflow::create([
            'amount' => 2000000,
            'description' => 'Initial cash',
            'type' => 'inflow',
            'balance_id' => 1
        ]);
    }
}
