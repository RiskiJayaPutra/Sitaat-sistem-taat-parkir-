# Panduan Deployment

## Server Requirements

### Minimum Requirements

- PHP >= 8.2
- MySQL/MariaDB >= 8.0
- Node.js >= 18.x
- Composer
- 2GB RAM (minimum)
- 10GB Disk Space

### Recommended

- PHP 8.3
- MySQL 8.0+
- 4GB RAM
- SSD Storage
- SSL Certificate

## Deployment ke Shared Hosting

### 1. Persiapan Backend

```bash
# Build production
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Zip folder untuk upload
zip -r backend.zip sistem-parkir-api
```

### 2. Upload Backend

1. Upload file `backend.zip` ke hosting
2. Extract di folder `public_html` atau `www`
3. Rename `.env.example` menjadi `.env`
4. Edit `.env`:

   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_DATABASE=your_database_name
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   ```

5. Jalankan di terminal hosting:
   ```bash
   php artisan key:generate
   php artisan migrate --force
   php artisan storage:link
   ```

### 3. Set Document Root

- Arahkan document root ke folder `public` di dalam `sistem-parkir-api`
- Contoh: `/home/username/public_html/sistem-parkir-api/public`

### 4. Build Frontend

```bash
cd sistem-parkir-ui
npm run build
```

### 5. Upload Frontend

- Upload folder `dist` ke subdomain atau folder terpisah
- Contoh: `app.yourdomain.com` atau `/public_html/app`

### 6. Configure .htaccess (Frontend)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Deployment ke VPS (Ubuntu)

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd -y

# Install MySQL
sudo apt install mysql-server -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Nginx
sudo apt install nginx -y
```

### 2. Setup MySQL

```bash
sudo mysql_secure_installation
sudo mysql -u root -p

# Di MySQL prompt:
CREATE DATABASE sistem_parkir;
CREATE USER 'parkir_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON sistem_parkir.* TO 'parkir_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Clone & Setup Backend

```bash
cd /var/www
sudo git clone https://github.com/RiskiJayaPutra/Sistem-taat-parkir-menggunakan-laravel-tailwind-dan-react.git parkir
cd parkir/sistem-parkir-api

sudo composer install --optimize-autoloader --no-dev
sudo cp .env.example .env
sudo nano .env  # Edit database credentials

sudo php artisan key:generate
sudo php artisan migrate --force
sudo php artisan storage:link
sudo php artisan config:cache
sudo php artisan route:cache
sudo php artisan view:cache

# Set permissions
sudo chown -R www-data:www-data /var/www/parkir
sudo chmod -R 755 /var/www/parkir
sudo chmod -R 775 /var/www/parkir/sistem-parkir-api/storage
sudo chmod -R 775 /var/www/parkir/sistem-parkir-api/bootstrap/cache
```

### 4. Configure Nginx - Backend

```bash
sudo nano /etc/nginx/sites-available/parkir-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/parkir/sistem-parkir-api/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/parkir-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Build & Setup Frontend

```bash
cd /var/www/parkir/sistem-parkir-ui
npm install
npm run build

# Move build to serve location
sudo mkdir -p /var/www/parkir-app
sudo cp -r dist/* /var/www/parkir-app/
```

### 6. Configure Nginx - Frontend

```bash
sudo nano /etc/nginx/sites-available/parkir-app
```

```nginx
server {
    listen 80;
    server_name app.yourdomain.com;
    root /var/www/parkir-app;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        log_not_found off;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/parkir-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Install SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com -d app.yourdomain.com
```

### 8. Setup Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Maintenance

### Update Application

```bash
cd /var/www/parkir
sudo git pull origin main

# Backend
cd sistem-parkir-api
sudo composer install --optimize-autoloader --no-dev
sudo php artisan migrate --force
sudo php artisan config:cache
sudo php artisan route:cache
sudo php artisan view:cache

# Frontend
cd ../sistem-parkir-ui
npm install
npm run build
sudo cp -r dist/* /var/www/parkir-app/
```

### Backup Database

```bash
mysqldump -u parkir_user -p sistem_parkir > backup_$(date +%Y%m%d).sql
```

### Monitor Logs

```bash
# Laravel logs
tail -f /var/www/parkir/sistem-parkir-api/storage/logs/laravel.log

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## Troubleshooting

### 502 Bad Gateway

```bash
sudo systemctl status php8.2-fpm
sudo systemctl restart php8.2-fpm
```

### Permission Issues

```bash
sudo chown -R www-data:www-data /var/www/parkir
sudo chmod -R 755 /var/www/parkir
```

### Clear Cache

```bash
cd /var/www/parkir/sistem-parkir-api
sudo php artisan cache:clear
sudo php artisan config:clear
sudo php artisan route:clear
sudo php artisan view:clear
```
