<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Unit>
 */
class UnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'pcs',
        ];
    }

    public function model2($names): static
    {
        $data = Arr::map($names, function ($name) {
            return ['name' => $name];
        });
        foreach ($data as $d) {
            Unit::factory()->create();
        }
        return $this->state(new Sequence(...$data));
    }

    public function dusAndPcs(): static
    {
        return $this->state(fn (array $attributes, Item $item) => [
            'parent_id' => Unit::factory()->create([
                'name' => 'dus',
                'item_id' => $item->id
            ])->id,
        ]);
    }

    public function rokok(): static
    {
        return $this->state(
            fn (array $attributes, Item $item) =>
            [
                'parent_Id' => Unit::factory()->create([
                    'parent_id' => Unit::factory()
                        ->state(fn (array $attributes) => [
                            'parent_id' => Unit::factory()
                                ->create(['name' => 'dus', 'item_id' => $item->id])->id,
                        ])
                        ->create([
                            'name' => 'slop',
                            'item_id' => $item->id
                        ])->id,
                    'name' => 'bks',
                    'item_id' => $item->id,
                ])->id,
                'item_id' => $item->id,
                'name' => 'btg'
            ]
        );
    }
}
