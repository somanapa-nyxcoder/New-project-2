import { describe, expect, it } from "vitest";
import { getTodayDateKeyInTimeZone } from "@/lib/date-utils";
import { buildDaySchedule, getCycleWeek } from "@/lib/schedule";
import { AppData } from "@/lib/types";

const appData: AppData = {
  config: {
    timezone: "America/Toronto",
    cycleStartDate: "2026-04-27",
    cookingStartTime: "10:00 AM",
    cookingEndTime: "11:30 AM",
    defaultGroceryTime: "08:30 PM",
  },
  roommates: [
    { name: "Soma", consumesChicken: true },
    { name: "Pavan", consumesChicken: true },
    { name: "Vijay", consumesChicken: false },
  ],
  meals: [
    {
      cycleWeek: 1,
      weekday: "Mon",
      curry1: "Tomato Pappu",
      curry2: "Beans Poriyal",
      chickenDish: "Pepper Chicken",
      cooksMain: ["Soma", "Vijay"],
      cooksChicken: ["Soma", "Pavan"],
      notes: "Week 1 Monday",
    },
    {
      cycleWeek: 1,
      weekday: "Wed",
      curry1: "Sambar",
      curry2: "Cabbage Stir Fry",
      chickenDish: "Andhra Chicken Fry",
      cooksMain: ["Pavan", "Vijay"],
      cooksChicken: ["Soma", "Pavan"],
      notes: "Week 1 Wednesday",
    },
    {
      cycleWeek: 1,
      weekday: "Fri",
      curry1: "Rasam",
      curry2: "Potato Roast",
      chickenDish: "Chicken Curry",
      cooksMain: ["Soma", "Pavan"],
      cooksChicken: ["Soma", "Pavan"],
      notes: "Week 1 Friday",
    },
  ],
  groceries: [
    {
      weekday: "Sun",
      time: "08:30 PM",
      itemsFresh: ["Tomato", "Onion"],
      itemsChicken: ["Chicken"],
      notes: "For Monday",
    },
    {
      weekday: "Tue",
      time: "08:30 PM",
      itemsFresh: ["Spinach", "Okra"],
      itemsChicken: ["Chicken", "Lemon"],
      notes: "For Wednesday",
    },
    {
      weekday: "Thu",
      time: "08:30 PM",
      itemsFresh: ["Potato", "Eggplant"],
      itemsChicken: ["Chicken", "Yogurt"],
      notes: "For Friday",
    },
  ],
};

describe("cycle week logic", () => {
  it("repeats every four weeks", () => {
    expect(getCycleWeek("2026-04-27", "2026-04-27")).toBe(1);
    expect(getCycleWeek("2026-04-27", "2026-05-04")).toBe(2);
    expect(getCycleWeek("2026-04-27", "2026-05-11")).toBe(3);
    expect(getCycleWeek("2026-04-27", "2026-05-18")).toBe(4);
    expect(getCycleWeek("2026-04-27", "2026-05-25")).toBe(1);
  });
});

describe("day event generation", () => {
  it("builds cooking events on monday", () => {
    const monday = buildDaySchedule("2026-04-27", appData);
    const types = monday.events.map((event) => event.type);

    expect(types).toContain("Cooking");
    expect(types).not.toContain("No Cook");
  });

  it("builds no-cook + grocery events on sunday", () => {
    const sunday = buildDaySchedule("2026-05-03", appData);
    const types = sunday.events.map((event) => event.type);

    expect(types[0]).toBe("No Cook");
    expect(types).toContain("Groceries");
  });

  it("shows carryover after cooking day", () => {
    const tuesday = buildDaySchedule("2026-04-28", appData);
    const carryover = tuesday.events.find((event) => event.type === "Carryover");

    expect(carryover).toBeDefined();
    expect(carryover?.details.join(" ")).toContain("Tomato Pappu");
    expect(carryover?.details.join(" ")).toContain("Soma, Pavan");
    expect(carryover?.details.join(" ")).not.toContain("Vijay");
  });

  it("adds tomorrow dishes dynamically to grocery task", () => {
    const tuesday = buildDaySchedule("2026-04-28", appData);
    const grocery = tuesday.events.find((event) => event.type === "Groceries");

    expect(grocery).toBeDefined();
    expect(grocery?.summary).toContain("Sambar");
    expect(grocery?.summary).toContain("Andhra Chicken Fry");
    expect(grocery?.details.join(" ")).toContain("Tomorrow dishes:");
  });
});

describe("timezone handling", () => {
  it("uses America/Toronto date near UTC boundary", () => {
    const now = new Date("2026-04-28T02:30:00.000Z");
    const dateKey = getTodayDateKeyInTimeZone("America/Toronto", now);

    expect(dateKey).toBe("2026-04-27");
  });
});
