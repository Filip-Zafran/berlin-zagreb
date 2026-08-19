"use client";

import { useState } from "react";
import { inputClass, submitClass } from "@/components/auth-shell";
import { TravelFlexibilityFields } from "@/components/travel-flexibility-fields";
import type { FlexibilityType } from "@/lib/travel-flexibility";

type InitialRequest = { id?: string; direction?: string; date?: string; time?: string; flexibilityType?: FlexibilityType; dateFlexibility?: any; timeFlexibility?: any; pickup?: string; dropoff?: string; notes?: string };

export function TransportRequestForm({ action, initial = {} }: { action: (data: FormData) => void | Promise<void>; initial?: InitialRequest }) {
  const [direction, setDirection] = useState(initial.direction ?? "to-berlin");
  const [flexibilityType, setFlexibilityType] = useState<FlexibilityType>(initial.flexibilityType ?? "fixed");
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const goingToBerlin = direction === "to-berlin";

  return (
    <form action={action} className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <label className="block text-sm font-bold text-slate-700">Direction
        <select className={inputClass} name="direction" value={direction} onChange={(event) => setDirection(event.target.value)}>
          <option value="to-berlin">To Berlin</option>
          <option value="from-berlin">From Berlin</option>
        </select>
      </label>
      <TravelFlexibilityFields type={flexibilityType} onTypeChange={setFlexibilityType} />
      <input type="hidden" name="today" value={todayKey} />
      <input type="hidden" name="date" value={initial.date ?? ""} />
      <input type="hidden" name="time" value={initial.time ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-bold text-slate-700">Pickup
          <input className={inputClass} name="pickup" required maxLength={100} defaultValue={initial.pickup} placeholder={goingToBerlin ? "Zagreb or nearby" : "Berlin or nearby"} />
        </label>
        <label className="block text-sm font-bold text-slate-700">Destination
          <input className={inputClass} name="dropoff" required maxLength={100} defaultValue={initial.dropoff} placeholder={goingToBerlin ? "Berlin" : "Zagreb or nearby"} />
        </label>
      </div>
      <label className="block text-sm font-bold text-slate-700">Additional notes
        <textarea className={`${inputClass} min-h-28 py-3`} name="notes" maxLength={1000} defaultValue={initial.notes} placeholder="Number of passengers, luggage, flexibility, pets…" />
      </label>
      <button className={submitClass} type="submit">Publish request</button>
    </form>
  );
}
