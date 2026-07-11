import Link from "next/link";
import GlitchImage from "@/components/GlitchImage";
import Seo from "@/components/Seo";
import JsonLd from "@/components/JsonLd";
import { getImages, getImage } from "@/lib/cloudinary";
import { cldUrl, encodePublicId } from "@/lib/cldUrl";
import { SITE_URL } from "@/lib/siteUrl";

export default function Wallpaper({ image }) {
	const name = image.title;
	const title = `${name} — Weird Phone Wallpaper | Lancecore`;
	const path = `/w/${encodePublicId(image.public_id)}`;
	const description = `${name} — a free weird phone wallpaper. ${image.width}×${image.height} ${image.format?.toUpperCase()}. Download high-res for iPhone & Android.`;
	const og = cldUrl(image.public_id, image.format, "c_scale,w_1200");
	const ogHeight = Math.round(1200 * (image.height / image.width));
	const download = cldUrl(image.public_id, image.format, "fl_attachment");
	const filename = `${name.replace(/\s+/g, "-")}.${image.format}`;

	const imageObject = {
		"@context": "https://schema.org",
		"@type": "ImageObject",
		name,
		description,
		contentUrl: cldUrl(image.public_id, image.format),
		thumbnailUrl: cldUrl(image.public_id, image.format, "c_scale,w_720"),
		width: image.width,
		height: image.height,
		encodingFormat: `image/${image.format}`,
		representativeOfPage: true,
		creator: {
			"@type": "Person",
			name: "Lance Boer",
			url: "https://lanceboer.com/",
		},
		mainEntityOfPage: `${SITE_URL}${path}`,
	};
	const breadcrumb = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Wallpapers",
				item: `${SITE_URL}/`,
			},
			{ "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
		],
	};

	return (
		<>
			<Seo
				title={title}
				description={description}
				path={path}
				image={og}
				imageAlt={image.alt}
				imageWidth={1200}
				imageHeight={ogHeight}
			/>
			<JsonLd data={imageObject} />
			<JsonLd data={breadcrumb} />

			<main id="main" className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-stone-400 outline-none hover:text-bone focus-visible:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					<span aria-hidden="true">←</span> Back to signals
				</Link>

				<div className="reveal mt-7">
					<div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-stone-400">
						<span className="whitespace-nowrap">
							Signal · {image.width}×{image.height} ·{" "}
							{image.format?.toUpperCase()}
						</span>
						<span className="h-px flex-1 bg-zinc-800" />
					</div>
					<h1 className="font-display glitch-text mt-5 text-4xl uppercase leading-[0.9] tracking-tight text-bone sm:text-6xl">
						{name}
					</h1>
				</div>

				<div className="reveal mt-8 border border-zinc-800 bg-zinc-950 p-2 sm:p-3">
					<GlitchImage
						src={cldUrl(
							image.public_id,
							image.format,
							"c_scale,w_1080"
						)}
						blurDataURL={cldUrl(
							image.public_id,
							image.format,
							"e_blur:2000,q_1"
						)}
						alt={image.alt}
						width={image.width}
						height={image.height}
						className="mx-auto max-h-[76vh] w-auto"
						priority
					/>
				</div>

				{image.alt && (
					<p className="reveal mt-6 text-sm leading-relaxed text-stone-400">
						{image.alt}
					</p>
				)}

				<div className="reveal mt-6 flex items-center justify-center border-t border-zinc-800 pt-5">
					<a
						href={download}
						download={filename}
						className="inline-flex items-center justify-center gap-3 border border-accent bg-accent/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] text-bone outline-none transition-colors hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
					>
						Download <span aria-hidden="true">↓</span>
					</a>
				</div>
			</main>
		</>
	);
}

export async function getStaticPaths() {
	const images = await getImages();
	return {
		paths: images.map((img) => ({
			params: { id: img.public_id.split("/") },
		})),
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const image = await getImage(params.id.join("/"));
	if (!image) return { notFound: true };
	return { props: { image } };
}
