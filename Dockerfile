FROM php:8.1-fpm

# Arguments defined in docker-compose.yml
# ARG user
# ARG uid

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    supervisor

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

#COPY . to workdir
COPY . /var/www
COPY ./docker-compose/supervisor/worker.conf /etc/supervisor/conf.d/

# Create system user to run Composer and Artisan Commands
# RUN useradd -G www-data,root -u $uid -d /home/$user $user
# RUN mkdir -p /home/$user/.composer && \
# chown -R $user:$user /home/$user && \
RUN chown -R www-data:www-data /var/www && \
    chown -R www-data:www-data /var/log


# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Set working directory
WORKDIR /var/www

RUN composer install
RUN npm install
RUN npm run build-ssr
RUN php artisan key:generate
RUN php artisan optimize:clear

# USER $user

EXPOSE 9000

CMD ["supervisord", "-n"]
