<?php

namespace Database\Seeders;

use App\Models\MasterUnit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasterUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arrayName = [
            ['dus', 'slop', 'bks', 'btg'],
            ['dus', 'rcg', 'pcs'],
            ['dus', 'pcs'],
            ['kilo'],
            ['liter'],
            ['pcs'],
            ['rupiah']
        ];
        foreach ($arrayName as $name) {
            MasterUnit::create(
                [
                    'name' => $name
                ]
            );
        }
    }
}
