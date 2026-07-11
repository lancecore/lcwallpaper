// Client-safe Cloudinary helpers (no server SDK — safe to import in components).
export const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Encode each path segment so public_ids with spaces/specials still route + deliver.
export function encodePublicId(publicId) {
	return publicId.split("/").map(encodeURIComponent).join("/");
}

export function cldUrl(publicId, format, transform) {
	const t = transform ? `${transform}/` : "";
	return `https://res.cloudinary.com/${CLOUD}/image/upload/${t}${encodePublicId(
		publicId
	)}.${format}`;
}

// Turn "wallpaper/No_War_but_Class_War_-_Red_Hoodie_t5g66q" into "No War but Class War - Red Hoodie".
// Strips the trailing random Cloudinary suffix; falls back to the default label.
export function humanizePublicId(publicId) {
	const base = publicId.split("/").pop() || "";
	const name = base
		.replace(/_[a-z0-9]{6,}$/i, "")
		.replace(/[_-]+/g, " ")
		.trim();
	return name || "Weird Wallpaper";
}
