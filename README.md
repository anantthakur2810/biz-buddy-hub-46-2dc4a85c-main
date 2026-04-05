# Biz Buddy Hub

Biz Buddy Hub is a React and TypeScript retail dashboard for small businesses. It includes an admin workspace for tracking revenue, customers, sales, inventory, and business benchmarks, plus a simple storefront flow for browsing products and placing orders.

## Features

- Dashboard overview with summary cards, charts, and alerts
- Dedicated pages for customers, sales, inventory, and benchmarks
- Storefront with product browsing, category filters, cart management, and checkout form
- Shared UI system built with shadcn/ui and Tailwind CSS

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Vitest

## Local Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

## Available Scripts

```sh
npm run dev
npm run build
npm run lint
npm run test
```

## Project Structure

- `src/pages` contains the main screens
- `src/components` contains layout, dashboard, and UI components
- `src/context` contains shared application state such as the cart
- `src/data` contains mock data used by the current prototype
- `src/test` contains Vitest tests

## Notes

- The current version uses mock data rather than a backend service
- Checkout is a front-end workflow and does not yet persist orders
