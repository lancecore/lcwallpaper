// Absolute base URL for canonical tags, sitemap, and Open Graph. Override per
// environment with NEXT_PUBLIC_SITE_URL (e.g. Netlify deploy previews); defaults
// to production. Trailing slashes stripped so `${SITE_URL}${path}` is always clean.
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || "https://lancecore.com"
).replace(/\/+$/, "");

export const absUrl = (path = "/") =>
	`${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
