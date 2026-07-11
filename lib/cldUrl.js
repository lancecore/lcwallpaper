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

// Cloudinary strips apostrophes from public_ids at upload ("we'd" -> "we_d"),
// so contractions lose them once humanized. Restore the common ones.
// ponytail: scoped to real contraction tokens so a title ending in a stray
// letter ("Plan B", "Vitamin D") is untouched; add a case here if one slips.
function restoreApostrophes(s) {
	return s
		.replace(/\b(\w*n) t\b/gi, "$1't") // don t, can t, isn t, wasn t, wouldn t
		.replace(
			/\b(we|you|they|i|he|she|it|who|that|there|here|what) d\b/gi,
			"$1'd"
		)
		.replace(/\b(we|you|they|i|who|that|there) ll\b/gi, "$1'll")
		.replace(/\b(we|you|they|i|who) ve\b/gi, "$1've")
		.replace(/\b(we|you|they|who) re\b/gi, "$1're")
		.replace(/\bi m\b/gi, "I'm");
}

// Turn "wallpaper/No_War_but_Class_War_-_Red_Hoodie_t5g66q" into "No War but Class War - Red Hoodie".
// Strips the trailing random Cloudinary suffix; falls back to the default label.
export function humanizePublicId(publicId) {
	const base = publicId.split("/").pop() || "";
	const name = restoreApostrophes(
		base
			.replace(/_[a-z0-9]{6,}$/i, "")
			.replace(/[_-]+/g, " ")
			.trim()
	);
	return name || "Weird Wallpaper";
}
