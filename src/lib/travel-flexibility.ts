export type FlexibilityType = "fixed" | "flexible-time" | "flexible-date" | "flexible-date-time";
export type DateFlexibility = "1-day" | "2-days" | "3-days" | "7-days" | "any-date";
export type TimeFlexibility = "1-hour" | "2-hours" | "4-hours" | "morning" | "afternoon" | "evening" | "any-time";

export type TravelSchedule = {
  departure: string;
  flexibilityType: FlexibilityType;
  dateFlexibility?: DateFlexibility;
  timeFlexibility?: TimeFlexibility;
};

export const flexibilityOptions: { value: FlexibilityType; label: string; description: string }[] = [
  { value: "fixed", label: "⏰ Fixed date & time", description: "I can only travel on the selected date and at the selected time." },
  { value: "flexible-time", label: "📅 Fixed date, flexible time", description: "The travel date is fixed, but the departure time is flexible." },
  { value: "flexible-date", label: "🕒 Flexible date, fixed time", description: "The departure time is important, but the travel date can change." },
  { value: "flexible-date-time", label: "🔄 Flexible date & time", description: "Both the travel date and departure time are flexible." },
];

export const dateFlexibilityOptions: { value: DateFlexibility; label: string }[] = [
  { value: "1-day", label: "±1 day" }, { value: "2-days", label: "±2 days" }, { value: "3-days", label: "±3 days" },
  { value: "7-days", label: "±7 days" }, { value: "any-date", label: "Any date" },
];

export const timeFlexibilityOptions: { value: TimeFlexibility; label: string }[] = [
  { value: "1-hour", label: "±1 hour" }, { value: "2-hours", label: "±2 hours" }, { value: "4-hours", label: "±4 hours" },
  { value: "morning", label: "Morning (06:00–12:00)" }, { value: "afternoon", label: "Afternoon (12:00–18:00)" },
  { value: "evening", label: "Evening (18:00–23:00)" }, { value: "any-time", label: "Any time" },
];

export function flexibilityPresentation(type: FlexibilityType) {
  return ({
    fixed: { label: "Fixed", icon: "🟢", className: "bg-emerald-50 text-emerald-700" },
    "flexible-time": { label: "Flexible Time", icon: "🟡", className: "bg-yellow-50 text-yellow-800" },
    "flexible-date": { label: "Flexible Date", icon: "🟠", className: "bg-orange-50 text-orange-700" },
    "flexible-date-time": { label: "Flexible Date & Time", icon: "🔵", className: "bg-blue-50 text-blue-700" },
  })[type];
}

export function flexibilityDescription(schedule: TravelSchedule) {
  const base = flexibilityOptions.find((option) => option.value === schedule.flexibilityType)?.label.replace(/^[^ ]+ /, "") ?? "Fixed date & time";
  const date = dateFlexibilityOptions.find((option) => option.value === schedule.dateFlexibility)?.label;
  const time = timeFlexibilityOptions.find((option) => option.value === schedule.timeFlexibility)?.label;
  return [base, date && `Date: ${date}`, time && `Time: ${time}`].filter(Boolean).join(" · ");
}

const dateDays: Record<DateFlexibility, number> = { "1-day": 1, "2-days": 2, "3-days": 3, "7-days": 7, "any-date": Number.POSITIVE_INFINITY };
function windows(schedule: TravelSchedule) {
  const departure = new Date(schedule.departure);
  const center = departure.getTime();
  const day = 86_400_000;
  const midnight = new Date(departure.getFullYear(), departure.getMonth(), departure.getDate()).getTime();
  let dateRange = schedule.dateFlexibility ? dateDays[schedule.dateFlexibility] * day : 0;
  if (!Number.isFinite(dateRange)) dateRange = 3650 * day;
  const minutes = departure.getHours() * 60 + departure.getMinutes();
  let timeStart = minutes; let timeEnd = minutes;
  if (schedule.timeFlexibility === "1-hour") { timeStart -= 60; timeEnd += 60; }
  if (schedule.timeFlexibility === "2-hours") { timeStart -= 120; timeEnd += 120; }
  if (schedule.timeFlexibility === "4-hours") { timeStart -= 240; timeEnd += 240; }
  if (schedule.timeFlexibility === "morning") { timeStart = 360; timeEnd = 720; }
  if (schedule.timeFlexibility === "afternoon") { timeStart = 720; timeEnd = 1080; }
  if (schedule.timeFlexibility === "evening") { timeStart = 1080; timeEnd = 1380; }
  if (schedule.timeFlexibility === "any-time") { timeStart = 0; timeEnd = 1439; }
  return { dateStart: midnight - dateRange, dateEnd: midnight + dateRange, timeStart, timeEnd, center };
}

export function matchDistance(a: TravelSchedule, b: TravelSchedule): number | null {
  const left = windows(a); const right = windows(b);
  const datesOverlap = left.dateStart <= right.dateEnd && right.dateStart <= left.dateEnd;
  const timesOverlap = left.timeStart <= right.timeEnd && right.timeStart <= left.timeEnd;
  if (!datesOverlap || !timesOverlap) return null;
  return Math.abs(left.center - right.center);
}

type ParsedFlexibility =
  | { error: string }
  | { flexibilityType: FlexibilityType; dateFlexibility: DateFlexibility | null; timeFlexibility: TimeFlexibility | null };

export function parseFlexibility(formData: FormData): ParsedFlexibility {
  const flexibilityType = String(formData.get("flexibilityType")) as FlexibilityType;
  const dateFlexibility = String(formData.get("dateFlexibility") || "") as DateFlexibility;
  const timeFlexibility = String(formData.get("timeFlexibility") || "") as TimeFlexibility;
  if (!flexibilityOptions.some((option) => option.value === flexibilityType)) return { error: "Choose travel flexibility." };
  if ((flexibilityType === "flexible-date" || flexibilityType === "flexible-date-time") && !dateFlexibilityOptions.some((option) => option.value === dateFlexibility)) return { error: "Choose date flexibility." };
  if ((flexibilityType === "flexible-time" || flexibilityType === "flexible-date-time") && !timeFlexibilityOptions.some((option) => option.value === timeFlexibility)) return { error: "Choose time flexibility." };
  return { flexibilityType, dateFlexibility: flexibilityType.includes("date") ? dateFlexibility : null, timeFlexibility: flexibilityType.includes("time") ? timeFlexibility : null };
}
