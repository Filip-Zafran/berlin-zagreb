const PRODUCTION_URL = "https://berlin-zagreb.vercel.app";

function withProtocol(value: string) {
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export function getSiteUrl(requestOrigin?: string | null) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) return withProtocol(configuredUrl).replace(/\/$/, "");

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProductionUrl) return withProtocol(vercelProductionUrl).replace(/\/$/, "");

  if (requestOrigin && !requestOrigin.includes("localhost") && !requestOrigin.includes("127.0.0.1")) {
    return requestOrigin.replace(/\/$/, "");
  }

  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : PRODUCTION_URL;
}
