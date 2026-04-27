## plan.md — Roommate Meal Planner Website

### Phase 1: MVP (Build First)

#### 1. Product Foundation
- Build with `Next.js (App Router)` for Vercel deployment.
- Mobile-first UI as primary experience.
- Timezone fixed to `America/Toronto`.
- Privacy model: unlisted URL (no login).

#### 2. Data Model (CSV-Driven)
- `config.csv`
  - `timezone`, `cycle_start_date`, `cooking_start_time`, `cooking_end_time`, `default_grocery_time`
- `roommates.csv`
  - `name`, `consumes_chicken`
  - Seed values: `Soma=true`, `Pavan=true`, `Vijay=false`
- `meal_plan.csv`
  - `cycle_week` (1-4), `weekday` (Mon/Wed/Fri), `curry1`, `curry2`, `chicken_dish`, `cooks_main`, `cooks_chicken`, `notes`
- `grocery_plan.csv`
  - `weekday` (Sun/Tue/Thu), `time` (`08:30 PM` default), `items_fresh`, `items_chicken`, `notes`
  - Grocery event output combines these basic items with dynamic tomorrow-dish context from `meal_plan.csv`.

#### 3. Scheduling Rules Engine
- Fixed cooking days: Monday, Wednesday, Friday (`10:00 AM - 11:30 AM`).
- Sunday always “No Cooking Day.”
- Grocery events on Sunday, Tuesday, Thursday evenings (`08:30 PM`).
- 4-week cycle repeats automatically forever from `cycle_start_date` (must be Monday).
- Consumption logic:
  - Curries and chicken from each cooking day are consumed for 2 days (cook day + next day).
  - Chicken shown as consumed only by Soma and Pavan.
- Grocery enrichment logic:
  - Grocery tasks show base grocery items from `grocery_plan.csv`.
  - Grocery tasks also show “tomorrow dishes” dynamically derived from next-day `meal_plan.csv` entries.

#### 4. Core Screens
- Home (`Today`)
  - Show today’s events: cooking/grocery/no-cook, time, dishes/items, assignees, notes.
  - If relevant, show carryover consumption from previous cooking day.
- Week Calendar
  - Compact cards/cells per day with event type + dish/grocery names + assignee summary.
- Month Calendar
  - Concise month grid with event type + short dish/item details + assignee/grocery summary.
  - Tap day to open quick detail panel.

#### 5. UX Requirements
- Strong readability and touch-friendly interactions on phones.
- One-tap navigation between Home, Week, and Month.
- Clear visual tags: `Cooking`, `Groceries`, `No Cook`, `Carryover`.
- Graceful fallback text (`Not planned`) if CSV row missing.

#### 6. Deployment and Ops
- Deploy to Vercel personal plan.
- Data update workflow:
  - Edit CSVs in GitHub
  - Push changes
  - Vercel auto-redeploys
- Add short `README` section for CSV format and edit instructions.

#### 7. MVP Validation
- Unit tests:
  - 4-week cycle index from `cycle_start_date`
  - Day/event generation rules
  - Carryover logic
  - Timezone boundary behavior
- UI checks:
  - Mobile layouts for Home/Week/Month
  - Event visibility for Mon/Wed/Fri/Sun/Tue/Thu scenarios

---

### Phase 2: Post-MVP Enhancements (Explicitly Excluded from Phase 1)

#### 1. Additional Schedule Domains
- Gym schedule integration.
- Daily/recurring habit tasks (example: soak oats at night).
- Essentials/staples reminders (eggs, milk, curd, etc.).

#### 2. Data + Admin Improvements
- In-app admin UI for editing schedule data (instead of GitHub CSV edits).
- Optional Google Sheets/Airtable sync.
- Event overrides for special weeks/holidays.

#### 3. Personalization and Collaboration
- Per-roommate filters/preferences.
- Assignment balancing suggestions.
- Optional notifications/reminders.

#### 4. Security and Access Upgrades
- Passcode gate or lightweight auth.
- Role-based edit/view model if admin tools are added.

---

### Acceptance Criteria
- App correctly shows today’s event details and notes from CSV.
- Week and month views show concise event type + dish/grocery names + assignees.
- 4-week cycle repeats correctly from configured Monday start date.
- Chicken consumption is never shown for Vijay.
- Sunday is always no-cook with grocery prep visibility.
- Grocery tasks include both base grocery items and dynamic tomorrow-dish context.
- CSV updates via GitHub are reflected after Vercel redeploy.

### Defaults and Assumptions
- `cycle_start_date` is provided before first release.
- Grocery default time is fixed at `08:30 PM`.
- MVP focuses on visibility/planning only (no in-app editing/auth).
