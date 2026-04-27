import ScheduleApp from "@/components/schedule-app";
import { getTodayDateKeyInTimeZone } from "@/lib/date-utils";
import { getAppData } from "@/lib/data";
import { buildDaySchedule, buildMonthGridSchedules, buildWeekSchedules } from "@/lib/schedule";

export const dynamic = "force-dynamic";

export default async function Home() {
  const appData = await getAppData();
  const todayDateKey = getTodayDateKeyInTimeZone(appData.config.timezone);

  const today = buildDaySchedule(todayDateKey, appData);
  const week = buildWeekSchedules(todayDateKey, appData);
  const month = buildMonthGridSchedules(todayDateKey, appData);

  return (
    <main className="app-wrap">
      <ScheduleApp today={today} week={week} month={month} timezone={appData.config.timezone} />
    </main>
  );
}
