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

        Item::factory(50)->has(Unit::factory()->count(1))->create([
            'master_unit_id' => $masterUnitId
        ]);
        Item::factory(50)->has(Unit::factory()->count(1))->beverage()->create([
            'master_unit_id' => $masterUnitId
        ]);

        $masterUnit2Id = 3;
        Item::factory(50)->has(Unit::factory()->rokok())->create([
            'master_unit_id' => $masterUnit2Id
        ]);
    }
}
