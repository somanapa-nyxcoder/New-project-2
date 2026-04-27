export type WeekdayCode = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export interface AppConfig {
  timezone: string;
  cycleStartDate: string;
  cookingStartTime: string;
  cookingEndTime: string;
  defaultGroceryTime: string;
}

export interface MealPlanRow {
  cycleWeek: 1 | 2 | 3 | 4;
  weekday: Extract<WeekdayCode, "Mon" | "Wed" | "Fri">;
  curry1: string;
  curry2: string;
  chickenDish: string;
  cooksMain: string[];
  cooksChicken: string[];
  notes: string;
}

export interface GroceryPlanRow {
  weekday: Extract<WeekdayCode, "Sun" | "Tue" | "Thu">;
  time: string;
  itemsFresh: string[];
  itemsChicken: string[];
  notes: string;
}

export interface Roommate {
  name: string;
  consumesChicken: boolean;
}

export interface AppData {
  config: AppConfig;
  meals: MealPlanRow[];
  groceries: GroceryPlanRow[];
  roommates: Roommate[];
}

export type EventType = "Cooking" | "Groceries" | "No Cook" | "Carryover";

export interface DayEvent {
  type: EventType;
  title: string;
  summary?: string;
  timeLabel?: string;
  notes?: string;
  details: string[];
}

export interface DaySchedule {
  dateKey: string;
  shortDateLabel: string;
  fullDateLabel: string;
  weekday: WeekdayCode;
  cycleWeek: 1 | 2 | 3 | 4;
  events: DayEvent[];
}
