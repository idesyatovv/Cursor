# Baseline Checkout

## Run locally

```bash
npm install
npm run dev
```

Run the production build with `npm run build` and the test suite with `npm run test:ci`.

## Request lifecycle

1. The home page links to `/checkout`.
2. The checkout page loads the server catalogue from `GET /api/products` and submits selected product IDs and quantities to `POST /api/checkout` using the guest user ID.
3. The checkout route validates the JSON body, user ID, items, product IDs, and positive integer quantities.
4. The server looks up prices from its hard-coded catalogue, computes the subtotal, applies the no-op discount extension point, and returns `{ "total": number }`.
5. Invalid or malformed requests return HTTP 400 with `{ "error": "<human-readable message>" }`.

The baseline uses floating-point dollar values and stores no data. It has no authentication, database, or external services.
