import type { TravelSchedule } from "@/lib/travel-flexibility";
import { flexibilityDescription, flexibilityPresentation } from "@/lib/travel-flexibility";

export function FlexibilityBadge({ schedule }: { schedule: TravelSchedule }) {
  const presentation = flexibilityPresentation(schedule.flexibilityType);
  const description = flexibilityDescription(schedule);
  return <details className="group relative inline-block">
    <summary aria-label={`Travel flexibility: ${description}`} className={`focus-ring cursor-pointer list-none rounded-full px-2.5 py-1 text-xs font-bold [&::-webkit-details-marker]:hidden ${presentation.className}`}>
      <span aria-hidden="true">{presentation.icon}</span> {presentation.label}
    </summary>
    <span role="tooltip" className="absolute left-0 top-full z-10 mt-2 hidden w-64 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium leading-5 text-white shadow-xl group-open:block">{description}</span>
  </details>;
}
