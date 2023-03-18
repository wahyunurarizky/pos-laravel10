<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\MasterUnit;
use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $masterUnitId = 6;

        Item::factory(10)->has(Unit::factory())->create([
            'master_unit_id' => $masterUnitId
        ]);
        Item::factory(10)->has(Unit::factory())->beverage()->create([
            'master_unit_id' => $masterUnitId
        ]);

        $masterUnit2Id = 3;
        Item::factory(10)->has(Unit::factory()->dusSlopBksBtg())->vegetable()->create([
            'master_unit_id' => $masterUnit2Id
        ]);
    }
}
