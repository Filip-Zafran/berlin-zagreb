import type { DateFlexibility, FlexibilityType, TimeFlexibility } from "@/lib/travel-flexibility";
import { dateFlexibilityOptions, flexibilityOptions, timeFlexibilityOptions } from "@/lib/travel-flexibility";
import { inputClass } from "@/components/auth-shell";

export function TravelFlexibilityFields({ type, onTypeChange, date, time, dateFlexibility, timeFlexibility }: { type: FlexibilityType; onTypeChange: (type: FlexibilityType) => void; date?: string; time?: string; dateFlexibility?: DateFlexibility; timeFlexibility?: TimeFlexibility }) {
  const flexibleDate = type === "flexible-date" || type === "flexible-date-time";
  const flexibleTime = type === "flexible-time" || type === "flexible-date-time";
  const selected = flexibilityOptions.find((option) => option.value === type)!;
  return <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
    <label className="block text-sm font-bold text-slate-700">Travel Flexibility
      <select className={inputClass} name="flexibilityType" value={type} onChange={(event) => onTypeChange(event.target.value as FlexibilityType)} required>
        {flexibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">{selected.description}</span>
    </label>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-bold text-slate-700">{type === "flexible-date-time" ? "Preferred Departure Date" : "Departure Date"}<input className={inputClass} name="date" type="date" required defaultValue={date} /></label>
      <label className="block text-sm font-bold text-slate-700">{type === "fixed" ? "Departure Time" : "Preferred Departure Time"}<input className={inputClass} name="time" type="time" required defaultValue={time} /></label>
    </div>
    <div className="grid gap-5 sm:grid-cols-2">
      {flexibleDate && <label className="block text-sm font-bold text-slate-700">Date Flexibility<select className={inputClass} name="dateFlexibility" required defaultValue={dateFlexibility ?? "1-day"}>{dateFlexibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>}
      {flexibleTime && <label className="block text-sm font-bold text-slate-700">Time Flexibility<select className={inputClass} name="timeFlexibility" required defaultValue={timeFlexibility ?? "1-hour"}>{timeFlexibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>}
    </div>
  </div>;
}
