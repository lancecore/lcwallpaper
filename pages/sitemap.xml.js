import { getImages } from "@/lib/cloudinary";
import { cldUrl, encodePublicId } from "@/lib/cldUrl";
import { SITE_URL } from "@/lib/siteUrl";

const escape = (s) =>
	s.replace(
		/[<>&'"]/g,
		(c) =>
			({
				"<": "&lt;",
				">": "&gt;",
				"&": "&amp;",
				"'": "&apos;",
				'"': "&quot;",
			})[c]
	);

// One <url> per page. Detail pages carry the Google image-sitemap extension so the
// cross-domain Cloudinary images get associated with the page that embeds them.
function buildSitemap(images) {
	const urls = [
		`<url><loc>${SITE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
		...images.map((img) => {
			const loc = `${SITE_URL}/w/${encodePublicId(img.public_id)}`;
			const imgLoc = cldUrl(img.public_id, img.format, "c_scale,w_1200");
			const title = escape(img.title);
			return `<url><loc>${loc}</loc><image:image><image:loc>${imgLoc}</image:loc><image:title>${title}</image:title></image:image></url>`;
		}),
	];

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;
}

export async function getServerSideProps({ res }) {
	const images = await getImages();
	res.setHeader("Content-Type", "application/xml");
	res.setHeader(
		"Cache-Control",
		"public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
	);
	res.write(buildSitemap(images));
	res.end();
	return { props: {} };
}

export default function Sitemap() {
	return null;
}
