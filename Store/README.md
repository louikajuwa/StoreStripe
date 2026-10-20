# Store (Stripe)

A Dockerized e-commerce store built with Laravel 11 + React 18 (Inertia/Vite), Stripe payments (test mode), and a Node.js + Socket.io realtime service for live admin payment updates.

## Prerequisites
- Docker Engine
- Docker Compose v2 (`docker compose`)
- Host ports **8000, 8888, 3000, 3307, 5173** free
- A Stripe **test** secret key (`sk_test_...`) for payment/webhook testing

## Run
```bash
docker compose up -d --build
```
This builds the `php` and `node` images and pulls `nginx`, `mysql`, `phpmyadmin`, and `stripe-cli`.

The shipped `app/` bind mount needs its PHP/JS dependencies installed and frontend assets built before pages render. On first run:
```bash
# Install dependencies (vendor/ and node_modules/ live in named volumes)
docker compose exec php composer install
docker compose exec php npm install

# Build the Vite frontend (writes public/build; pages return HTTP 500 without it)
docker compose exec php npm run build

# Run migrations + seed the database
docker compose exec php php artisan migrate --seed --force

# Clear caches and fix storage permissions
docker compose exec php php artisan optimize:clear
docker compose exec php chmod -R 775 storage bootstrap/cache
docker compose exec php chown -R www-data:www-data storage bootstrap/cache
```

Optional frontend dev server (live reload) on port 5173:
```bash
docker compose exec php npm run dev
```

## Services
| Service | Image/Build | Purpose | Port (host:container) | URL |
|---------|-------------|---------|-----------------------|-----|
| nginx | `nginx:1.25-alpine` | Web server / reverse proxy to php-fpm | 8000:80 | http://localhost:8000 |
| php | build `docker/php/Dockerfile` (php:8.2-fpm) | Laravel 11 app (php-fpm) + Node 20 for Vite builds | 5173:5173 | (Vite dev) http://localhost:5173 |
| node | build `docker/node/Dockerfile` (node:20-alpine) | Socket.io realtime server | 3000:3000 | http://localhost:3000 |
| mysql | `mysql:8.0` | Database | 3307:3306 | `127.0.0.1:3307` |
| phpmyadmin | `phpmyadmin:latest` | Database admin UI | 8888:80 | http://localhost:8888 |
| stripe-cli | `stripe/stripe-cli:latest` | Forwards Stripe webhooks to `http://nginx/api/stripe/webhook` | — | — |

Admin panel: http://localhost:8000/admin/login

## Environment

### `./.env` (Docker Compose — root)
Consumed by the `mysql` and `stripe-cli` services.

| Key | Default | Purpose |
|-----|---------|---------|
| `MYSQL_ROOT_PASSWORD` | `rootpassword` | MySQL root password (also used by phpMyAdmin) |
| `MYSQL_DATABASE` | `store` | Database name |
| `MYSQL_USER` | `store_user` | Application DB user |
| `MYSQL_PASSWORD` | `secret` | Application DB password |
| `STRIPE_SECRET_KEY` | _(none — required)_ | Your Stripe test secret key `sk_test_...`, passed to the Stripe CLI as `STRIPE_API_KEY` |

> Never commit a real Stripe key. Paste your own `sk_test_...` into `./.env` before running.

The `node` service reads its env inline from `docker-compose.yml`: `PORT=3000` and `API_SECRET=realtime-secret-key`.

### `app/.env` (Laravel)
`APP_KEY` and DB settings are preconfigured to match the MySQL container. Stripe keys are blank by default and must be filled in for payments:

| Key | Default | Purpose |
|-----|---------|---------|
| `APP_URL` | `http://localhost:8000` | Base URL |
| `DB_HOST` | `mysql` | DB host (compose service name) |
| `DB_DATABASE` | `store` | DB name |
| `DB_USERNAME` | `store_user` | DB user |
| `DB_PASSWORD` | `secret` | DB password |
| `STRIPE_KEY` | _(empty)_ | Stripe publishable key `pk_test_...` |
| `STRIPE_SECRET` | _(empty)_ | Stripe secret key `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | _(empty)_ | Stripe webhook signing secret `whsec_...` |
| `REALTIME_SERVER_URL` | `http://node:3000` | Realtime service URL |
| `REALTIME_API_SECRET` | `realtime-secret-key` | Shared secret with the node service |

To get the webhook secret:
```bash
docker compose logs stripe-cli    # copy "Your webhook signing secret is whsec_..."
# set STRIPE_WEBHOOK_SECRET=whsec_... in app/.env, then:
docker compose exec php php artisan config:clear
```

## Volumes & persistence
Named volumes:
- `mysql-data` → `/var/lib/mysql` (database data)
- `vendor-data` → `/var/www/html/vendor` (Composer dependencies)
- `node-modules-data` → `/var/www/html/node_modules` (Laravel frontend deps)

Bind mounts:
- `./app` → `/var/www/html` (Laravel source, shared by nginx + php)
- `./realtime` → `/usr/src/app` (realtime server source, node service; its `node_modules` is an anonymous volume)
- `./docker/nginx/default.conf` → nginx site config

`docker compose down` keeps the named volumes; `docker compose down -v` removes them (wipes the database and dependency caches).

## Common commands
```bash
docker compose logs -f              # follow all logs
docker compose logs -f stripe-cli   # one service
docker compose ps                   # service status
docker compose down                 # stop & remove containers (keeps volumes)
docker compose down -v              # also remove named volumes (wipes DB)
docker compose up -d --build        # rebuild images and restart

# Run inside the Laravel container
docker compose exec php bash
docker compose exec php php artisan migrate --seed --force   # migrate + seed
docker compose exec php php artisan optimize:clear           # clear caches
```

## Verify
```bash
curl -I http://localhost:8000              # store        -> 200
curl -I http://localhost:8000/admin/login  # admin login  -> 200
curl -I http://localhost:8888              # phpMyAdmin   -> 200
docker compose ps                          # all 6 services Up
```
- Store: http://localhost:8000
- Admin panel: http://localhost:8000/admin/login — seeded credentials `admin` / `admin`
- Test card at checkout: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP

> If the storefront loads blank or its HTML references `http://localhost:517x` (Vite dev mode), a stale `public/hot` file is forcing dev mode. Fix:
> ```bash
> docker compose exec php rm -f public/hot
> docker compose exec php php artisan optimize:clear
> ```
