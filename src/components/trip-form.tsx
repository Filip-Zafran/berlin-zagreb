"use client";

import { useState } from "react";
import { inputClass, submitClass } from "@/components/auth-shell";

type InitialTrip = { id?: string; direction?: string; date?: string; time?: string; carModel?: string; price?: string; stops?: string[]; notes?: string };

export function TripForm({ action, initial = {} }: { action: (data: FormData) => void | Promise<void>; initial?: InitialTrip }) {
  const [direction, setDirection] = useState(initial.direction ?? "berlin-zagreb");
  const [stops, setStops] = useState<string[]>(initial.stops ?? []);
  const [newStop, setNewStop] = useState("");
  const move = (index: number, offset: number) => { const next = [...stops]; const target = index + offset; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setStops(next); };
  const add = () => { const value = newStop.trim(); if (value) { setStops([...stops, value]); setNewStop(""); } };
  return <form action={action} className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    {initial.id && <input type="hidden" name="id" value={initial.id} />}<input type="hidden" name="stops" value={JSON.stringify(stops)} />
    <label className="block text-sm font-bold text-slate-700">Direction<select className={inputClass} name="direction" value={direction} onChange={(e) => setDirection(e.target.value)}><option value="berlin-zagreb">Berlin → Zagreb</option><option value="zagreb-berlin">Zagreb → Berlin</option></select></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-bold text-slate-700">Departure date<input className={inputClass} name="date" type="date" required defaultValue={initial.date} /></label><label className="block text-sm font-bold text-slate-700">Departure time<input className={inputClass} name="time" type="time" required defaultValue={initial.time} /></label></div>
    <label className="block text-sm font-bold text-slate-700">Car model<input className={inputClass} name="carModel" required maxLength={100} defaultValue={initial.carModel} placeholder="Volkswagen Passat" /></label>
    <label className="block text-sm font-bold text-slate-700">Price<input className={inputClass} name="price" maxLength={100} defaultValue={initial.price} placeholder="€80, by agreement, or your preferred terms" /><span className="mt-2 block text-xs font-normal text-slate-400">Write the amount or arrangement in your own words.</span></label>
    <div><p className="text-sm font-bold text-slate-700">Route</p><p className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">{direction === "berlin-zagreb" ? "Berlin" : "Zagreb"} → planned stops → {direction === "berlin-zagreb" ? "Zagreb" : "Berlin"}</p></div>
    <div><label className="block text-sm font-bold text-slate-700" htmlFor="new-stop">Planned stops</label><div className="mt-2 flex gap-2"><input id="new-stop" className={`${inputClass} mt-0`} value={newStop} onChange={(e) => setNewStop(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Vienna" /><button type="button" onClick={add} className="focus-ring rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">Add</button></div>
      <ul className="mt-3 space-y-2">{stops.map((stop, index) => <li key={`${stop}-${index}`} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">{index + 1}. {stop}</span><button type="button" aria-label={`Move ${stop} up`} onClick={() => move(index, -1)} disabled={index === 0} className="rounded-lg px-2 py-1 disabled:opacity-25">↑</button><button type="button" aria-label={`Move ${stop} down`} onClick={() => move(index, 1)} disabled={index === stops.length - 1} className="rounded-lg px-2 py-1 disabled:opacity-25">↓</button><button type="button" aria-label={`Remove ${stop}`} onClick={() => setStops(stops.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg px-2 py-1 text-red-600">Remove</button></li>)}</ul>
    </div>
    <label className="block text-sm font-bold text-slate-700">Additional notes<textarea className={`${inputClass} min-h-28 py-3`} name="notes" maxLength={1000} defaultValue={initial.notes} placeholder="Luggage, breaks, pickup details…" /></label>
    <button className={submitClass} type="submit">{initial.id ? "Save changes" : "Publish trip"}</button>
  </form>;
}
