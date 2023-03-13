<?php

use FakerRestaurant\Provider\id_ID\Restaurant;

if (!function_exists('myFake') && class_exists(\Faker\Factory::class)) {
    /**
     * Get a faker instance.
     *
     * @param  string|null  $locale
     * @return \Faker\Generator
     */
    function myFake($locale = null)
    {
        if (app()->bound('config')) {
            $locale ??= app('config')->get('app.faker_locale');
        }

        $locale ??= 'en_US';

        $abstract = \Faker\Generator::class . ':' . $locale;

        $faker = \Faker\Factory::create($locale);
        $faker->addProvider(new Restaurant($faker));
        app()->singleton($abstract, fn () => $faker);

        return app()->make($abstract);

        // if (!app()->bound($abstract)) {
        //     $faker = \Faker\Factory::create($locale);
        //     $faker->addProvider(new Restaurant($faker));
        //     app()->singleton($abstract, fn () => $faker);
        // }
    }
}
