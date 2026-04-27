import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseCsv, splitList } from "@/lib/csv";
import { AppData, AppConfig, GroceryPlanRow, MealPlanRow, Roommate, WeekdayCode } from "@/lib/types";

const DATA_DIRECTORY = path.join(process.cwd(), "data");

export const getAppData = cache(async (): Promise<AppData> => {
  const [config, meals, groceries, roommates] = await Promise.all([
    readConfig(),
    readMeals(),
    readGroceries(),
    readRoommates(),
  ]);

  return {
    config,
    meals,
    groceries,
    roommates,
  };
});

async function readConfig(): Promise<AppConfig> {
  const rows = await readCsvFile("config.csv");
  const row = rows[0];

  if (!row) {
    throw new Error("Missing config.csv row");
  }

  return {
    timezone: row.timezone || "America/Toronto",
    cycleStartDate: row.cycle_start_date,
    cookingStartTime: row.cooking_start_time || "10:00 AM",
    cookingEndTime: row.cooking_end_time || "11:30 AM",
    defaultGroceryTime: row.default_grocery_time || "08:30 PM",
  };
}

async function readMeals(): Promise<MealPlanRow[]> {
  const rows = await readCsvFile("meal_plan.csv");

  return rows.map((row) => {
    const week = Number(row.cycle_week);

    if (![1, 2, 3, 4].includes(week)) {
      throw new Error(`Invalid cycle_week in meal_plan.csv: ${row.cycle_week}`);
    }

    return {
      cycleWeek: week as 1 | 2 | 3 | 4,
      weekday: row.weekday as Extract<WeekdayCode, "Mon" | "Wed" | "Fri">,
      curry1: row.curry1,
      curry2: row.curry2,
      chickenDish: row.chicken_dish,
      cooksMain: splitList(row.cooks_main),
      cooksChicken: splitList(row.cooks_chicken),
      notes: row.notes,
    };
  });
}

async function readGroceries(): Promise<GroceryPlanRow[]> {
  const rows = await readCsvFile("grocery_plan.csv");

  return rows.map((row) => ({
    weekday: row.weekday as Extract<WeekdayCode, "Sun" | "Tue" | "Thu">,
    time: row.time,
    itemsFresh: splitList(row.items_fresh),
    itemsChicken: splitList(row.items_chicken),
    notes: row.notes,
  }));
}

async function readRoommates(): Promise<Roommate[]> {
  const rows = await readCsvFile("roommates.csv");

  return rows.map((row) => ({
    name: row.name,
    consumesChicken: `${row.consumes_chicken}`.toLowerCase() === "true",
  }));
}

async function readCsvFile(filename: string): Promise<Record<string, string>[]> {
  const filePath = path.join(DATA_DIRECTORY, filename);
  const csvText = await fs.readFile(filePath, "utf-8");
  return parseCsv(csvText);
}
