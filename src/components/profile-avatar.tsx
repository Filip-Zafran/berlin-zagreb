export function ProfileAvatar({ name, avatarUrl, size = "large" }: { name: string; avatarUrl?: string | null; size?: "small" | "large" }) {
  const initials = name.trim().slice(0, 2).toUpperCase() || "V";
  return (
    <span role="img" aria-label={`${name} profile picture`} style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined} className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 bg-cover bg-center font-bold text-white shadow-sm ring-4 ring-white ${size === "large" ? "size-24 text-2xl" : "size-10 text-xs"}`}>
      {!avatarUrl && initials}
    </span>
  );
}
