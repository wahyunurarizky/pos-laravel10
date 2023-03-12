<?php

namespace Database\Seeders;

use App\Models\Balance;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BalanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Balance::firstOrCreate(
            [
                'name' => 'cash',
            ],
            [
                'name' => 'cash',
                'amount' => 0
            ]
        );
    }
}
