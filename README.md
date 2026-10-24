# 9-11 Foods (Next.js + MongoDB)

1. `npm install`
2. `cp .env.example .env.local` and set `MONGODB_URI` (local Mongo or Atlas)
3. `npm run seed` (needs Node 20.6+; loads 5 restaurants and 10 foods)
4. `npm run dev` and open http://localhost:3000

API: `GET /api/restaurants`, `GET /api/restaurants/:id`, `GET /api/foods?q=&category=`, `GET|POST /api/orders`

Tests: `npm test` (cart, order pricing and seed-data checks, no database needed)
