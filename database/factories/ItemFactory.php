<?php

namespace Database\Factories;

use FakerRestaurant\Provider\id_ID\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => Str::upper(myFake()->foodName()),
            'bottom_unit_qty' => myFake()->randomNumber(1)
        ];
    }

    public function beverage(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => Str::upper(myFake()->beverageName()),
        ]);
    }

    public function vegetable(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => Str::upper(myFake()->vegetableName()),
        ]);
    }
}
