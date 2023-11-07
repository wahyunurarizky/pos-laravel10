### made with laravel

step run in your local
make sure you already have these

1. mysql
2. redis
3. composer
4. php version >=8.1
5. nodejs version >=18

lets go

1. composer install
   1.5. npm install
2. copy env
   2.5. php artisan migrate:fresh --seed
3. php artisan serve
4. npm run dev
5. php artisan queue:work

<!-- DOCKER COMPOSE -->

docker-compose up -d --build

<!-- IF YOU WANT MIGRATE AND SEED -->

docker-compose exec -t app php artisan migrate:fresh --seed
