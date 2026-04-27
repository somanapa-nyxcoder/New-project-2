# Roommate Meal Planner

Mobile-first meal and grocery planner for 3 roommates, built with Next.js (App Router), designed for Vercel deployment.

## Features

- Home (`Today`) view with event cards for:
  - Cooking (`Mon/Wed/Fri`, `10:00 AM - 11:30 AM`)
  - Groceries (`Sun/Tue/Thu`, default `08:30 PM`)
  - No-cook Sunday
  - Carryover consumption (day 2)
- Week view with compact daily cards.
- Month view with concise cells and tap-to-open day details.
- 4-week meal cycle auto-repeats from a configured Monday start date.
- Chicken consumption shown only for roommates marked `consumes_chicken=true`.
- CSV-driven data (edit in GitHub and redeploy on Vercel).

## Data Files

All data lives in `data/`.

### `data/config.csv`

Columns:

- `timezone`
- `cycle_start_date`
- `cooking_start_time`
- `cooking_end_time`
- `default_grocery_time`

### `data/roommates.csv`

Columns:

- `name`
- `consumes_chicken` (`true`/`false`)

### `data/meal_plan.csv`

Columns:

- `cycle_week` (`1-4`)
- `weekday` (`Mon`/`Wed`/`Fri`)
- `curry1`
- `curry2`
- `chicken_dish`
- `cooks_main` (semicolon-separated)
- `cooks_chicken` (semicolon-separated)
- `notes`

### `data/grocery_plan.csv`

Columns:

- `weekday` (`Sun`/`Tue`/`Thu`)
- `time`
- `items_fresh` (semicolon-separated)
- `items_chicken` (semicolon-separated)
- `notes`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run test
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel (personal plan is enough).
3. Keep framework preset as `Next.js`.
4. Deploy.

### Updating Schedule Data

1. Edit CSV files in `data/` via GitHub.
2. Commit and push.
3. Vercel auto-redeploys and the app updates.
