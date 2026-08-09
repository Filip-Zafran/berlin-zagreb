"use client";

import { useMemo, useState } from "react";
import { RouteColumn } from "@/components/route-column";
import type { Trip } from "@/data/trips";

export function TripBrowser({ trips }: { trips: Trip[] }) {
  const [selectedDate, setSelectedDate] = useState("");
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const filteredTrips = useMemo(
    () =>
      trips
        .filter((trip) => trip.departure.slice(0, 10) >= todayKey)
        .filter((trip) => !selectedDate || trip.departure.slice(0, 10) === selectedDate),
    [selectedDate, todayKey, trips],
  );

  return (
    <>
      <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Departure date</p>
          <p className="mt-0.5 text-sm text-slate-500">See rides leaving when you need them.</p>
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="departure-date">Choose a departure date</label>
          <input
            id="departure-date"
            type="date"
            value={selectedDate}
            min={todayKey}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="focus-ring min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 sm:min-w-48"
          />
          <button
            type="button"
            onClick={() => setSelectedDate("")}
            disabled={!selectedDate}
            className="focus-ring min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      <section aria-label="Upcoming trips" className="grid items-start gap-5 lg:grid-cols-2">
        <RouteColumn direction="Berlin → Zagreb" description="Southbound rides" tone="orange" trips={filteredTrips.filter((trip) => trip.direction === "berlin-zagreb")} />
        <RouteColumn direction="Zagreb → Berlin" description="Northbound rides" tone="blue" trips={filteredTrips.filter((trip) => trip.direction === "zagreb-berlin")} />
      </section>
    </>
  );
}
