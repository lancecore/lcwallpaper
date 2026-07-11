import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";
import { humanizePublicId } from "./cldUrl";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ponytail: one folder search per build. `next build` runs getStaticProps across
// several workers that don't share memory, so we memo to disk — the first call
// (getStaticPaths, on the main thread) fetches; every worker after reads the file.
// New Cloudinary uploads need a rebuild to appear (the site is fully SSG anyway).
const CACHE_FILE = path.join(process.cwd(), ".cloudinary-cache.json");
let cache;

export async function getImages() {
	if (cache) return cache;
	try {
		if (fs.existsSync(CACHE_FILE)) {
			cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
			return cache;
		}
	} catch {
		// unreadable cache → fall through and fetch fresh
	}

	const results = await cloudinary.v2.search
		.expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
		.with_field("context")
		.sort_by("created_at", "desc")
		.max_results(400)
		.execute();

	cache = (results.resources || []).map((r, i) => ({
		id: i,
		height: r.height,
		width: r.width,
		public_id: r.public_id,
		format: r.format,
		alt:
			r.context && r.context.alt
				? r.context.alt
				: humanizePublicId(r.public_id),
	}));

	try {
		fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
	} catch {
		// non-writable FS → keep the in-memory memo, just don't share across workers
	}
	return cache;
}

export async function getImage(publicId) {
	const images = await getImages();
	return images.find((img) => img.public_id === publicId) || null;
}
