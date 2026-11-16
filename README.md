# Store (Stripe)

E-commerce store with Stripe checkout (test mode) and an admin panel with live payment updates.

**Stack:** Laravel 11 · React 18 (Inertia + Vite) · MySQL · Stripe · Node.js + Socket.IO · Docker

## Features

- Product catalogue and per-product Stripe checkout
- Stripe webhooks to record payments
- Admin area: product CRUD and a payments list that updates in real time

## Quick start

```bash
cd Store
cp .env.example .env            # add your Stripe test keys (sk_test_..., whsec_...)
cp app/.env.example app/.env
cp realtime/.env.example realtime/.env
docker compose up -d --build
docker compose exec php composer install
docker compose exec php npm install && docker compose exec php npm run build
docker compose exec php php artisan migrate --seed --force
```

Open http://localhost:8000 (admin: http://localhost:8000/admin/login).

Full setup, services and ports are in [`Store/README.md`](Store/README.md).

## License

MIT — see [LICENSE](LICENSE).
