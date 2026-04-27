import { addDays, diffDays, formatFullDateLabel, formatShortDateLabel, getMonthGridStartDate, getWeekStartDate, getWeekdayCode } from "@/lib/date-utils";
import { AppData, DayEvent, DaySchedule, MealPlanRow, WeekdayCode } from "@/lib/types";

const COOKING_DAYS: WeekdayCode[] = ["Mon", "Wed", "Fri"];
const GROCERY_DAYS: WeekdayCode[] = ["Sun", "Tue", "Thu"];

export function getCycleWeek(cycleStartDate: string, targetDate: string): 1 | 2 | 3 | 4 {
  const dayDelta = diffDays(cycleStartDate, targetDate);
  const cycleOffset = Math.floor(dayDelta / 7);
  const normalized = ((cycleOffset % 4) + 4) % 4;
  return (normalized + 1) as 1 | 2 | 3 | 4;
}

export function buildDaySchedule(dateKey: string, appData: AppData): DaySchedule {
  const weekday = getWeekdayCode(dateKey);
  const cycleWeek = getCycleWeek(appData.config.cycleStartDate, dateKey);
  const events: DayEvent[] = [];

  const mealByKey = createMealLookup(appData.meals);
  const groceryByDay = new Map(appData.groceries.map((row) => [row.weekday, row]));

  if (COOKING_DAYS.includes(weekday)) {
    const meal = mealByKey.get(getMealLookupKey(cycleWeek, weekday as "Mon" | "Wed" | "Fri"));
    if (meal) {
      events.push({
        type: "Cooking",
        title: `Cook ${meal.curry1} + ${meal.curry2}`,
        summary: `Assignees: Main ${meal.cooksMain.join(", ") || "Not planned"} | Chicken ${meal.cooksChicken.join(", ") || "Not planned"}`,
        timeLabel: `${appData.config.cookingStartTime} - ${appData.config.cookingEndTime}`,
        details: [
          `Curry 1: ${meal.curry1}`,
          `Curry 2: ${meal.curry2}`,
          `Chicken: ${meal.chickenDish}`,
          `Main cooking: ${meal.cooksMain.join(", ") || "Not planned"}`,
          `Chicken cooks: ${meal.cooksChicken.join(", ") || "Not planned"}`,
        ],
        notes: meal.notes || "",
      });
    } else {
      events.push({
        type: "Cooking",
        title: "Cooking scheduled",
        timeLabel: `${appData.config.cookingStartTime} - ${appData.config.cookingEndTime}`,
        details: ["Not planned"],
      });
    }
  }

  if (GROCERY_DAYS.includes(weekday)) {
    const grocery = groceryByDay.get(weekday as "Sun" | "Tue" | "Thu");
    const nextDate = addDays(dateKey, 1);
    const nextWeekday = getWeekdayCode(nextDate);
    const nextCycleWeek = getCycleWeek(appData.config.cycleStartDate, nextDate);
    const nextMeal =
      COOKING_DAYS.includes(nextWeekday)
        ? mealByKey.get(getMealLookupKey(nextCycleWeek, nextWeekday as "Mon" | "Wed" | "Fri"))
        : null;

    const tomorrowDishes = nextMeal
      ? `${nextMeal.curry1}, ${nextMeal.curry2}, ${nextMeal.chickenDish}`
      : "Not planned";

    events.push({
      type: "Groceries",
      title: "Buy fresh groceries",
      summary: `For tomorrow dishes: ${tomorrowDishes}`,
      timeLabel: grocery?.time || appData.config.defaultGroceryTime,
      details: [
        `Fresh items: ${grocery?.itemsFresh.join(", ") || "Not planned"}`,
        `Chicken items: ${grocery?.itemsChicken.join(", ") || "Not planned"}`,
        `Tomorrow dishes: ${tomorrowDishes}`,
      ],
      notes: grocery?.notes || "",
    });
  }

  if (weekday === "Sun") {
    events.unshift({
      type: "No Cook",
      title: "No Cooking Day",
      details: ["Order food / rest day"],
    });
  }

  const carryoverEvent = buildCarryoverEvent(dateKey, appData, mealByKey);
  if (carryoverEvent) {
    events.push(carryoverEvent);
  }

  return {
    dateKey,
    weekday,
    cycleWeek,
    shortDateLabel: formatShortDateLabel(dateKey),
    fullDateLabel: formatFullDateLabel(dateKey),
    events,
  };
}

export function buildWeekSchedules(anchorDateKey: string, appData: AppData): DaySchedule[] {
  const weekStart = getWeekStartDate(anchorDateKey);
  return Array.from({ length: 7 }, (_, index) => buildDaySchedule(addDays(weekStart, index), appData));
}

export function buildMonthGridSchedules(anchorDateKey: string, appData: AppData): DaySchedule[] {
  const gridStart = getMonthGridStartDate(anchorDateKey);
  return Array.from({ length: 42 }, (_, index) => buildDaySchedule(addDays(gridStart, index), appData));
}

function buildCarryoverEvent(dateKey: string, appData: AppData, mealByKey: Map<string, MealPlanRow>): DayEvent | null {
  const previousDate = addDays(dateKey, -1);
  const previousWeekday = getWeekdayCode(previousDate);

  if (!COOKING_DAYS.includes(previousWeekday)) {
    return null;
  }

  const previousCycleWeek = getCycleWeek(appData.config.cycleStartDate, previousDate);
  const previousMeal = mealByKey.get(
    getMealLookupKey(previousCycleWeek, previousWeekday as "Mon" | "Wed" | "Fri"),
  );

  if (!previousMeal) {
    return null;
  }

  const chickenConsumers = appData.roommates.filter((roommate) => roommate.consumesChicken).map((roommate) => roommate.name);

  return {
    type: "Carryover",
    title: "Carryover (Day 2 consumption)",
    summary: `Chicken consumers: ${chickenConsumers.join(", ") || "Not planned"}`,
    details: [
      `Curries: ${previousMeal.curry1}, ${previousMeal.curry2}`,
      `Chicken: ${previousMeal.chickenDish}`,
      `Chicken consumers: ${chickenConsumers.join(", ") || "Not planned"}`,
    ],
  };
}

function createMealLookup(meals: MealPlanRow[]): Map<string, MealPlanRow> {
  return new Map(meals.map((meal) => [getMealLookupKey(meal.cycleWeek, meal.weekday), meal]));
}

function getMealLookupKey(week: number, weekday: "Mon" | "Wed" | "Fri"): string {
  return `${week}-${weekday}`;
}
