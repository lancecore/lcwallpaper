import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import GlitchImage from "@/components/GlitchImage";
import Seo from "@/components/Seo";
import JsonLd from "@/components/JsonLd";
import { getImages } from "@/lib/cloudinary";
import { cldUrl, encodePublicId } from "@/lib/cldUrl";
import { SITE_URL } from "@/lib/siteUrl";

const DESCRIPTION =
	"Free, weird, glitchy wallpapers for your phone. Download high-resolution iPhone and Android backgrounds — a rogue broadcast from Lancecore.";

export default function Home({ images = [] }) {
	const featured = images[0];
	const ogImage = featured
		? cldUrl(featured.public_id, featured.format, "c_scale,w_1200")
		: undefined;
	const ogHeight = featured
		? Math.round(1200 * (featured.height / featured.width))
		: undefined;

	const collection = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Weird Phone Wallpapers",
		description: DESCRIPTION,
		url: `${SITE_URL}/`,
		isPartOf: { "@type": "WebSite", name: "Lancecore", url: SITE_URL },
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: images.length,
			// ponytail: cap the inline list at 24 so a 400-image gallery doesn't
			// bloat the HTML; the sitemap carries the full set for crawlers.
			itemListElement: images.slice(0, 24).map((img, i) => ({
				"@type": "ListItem",
				position: i + 1,
				url: `${SITE_URL}/w/${encodePublicId(img.public_id)}`,
				name: img.title,
			})),
		},
	};

	return (
		<>
			<Seo
				title="Weird Phone Wallpapers — Free Downloads | Lancecore"
				description={DESCRIPTION}
				path="/"
				image={ogImage}
				imageAlt={featured?.alt}
				imageWidth={ogImage ? 1200 : undefined}
				imageHeight={ogHeight}
			/>
			<JsonLd data={collection} />

			<Hero count={images.length} />

			<main id="main" className="mx-auto w-full max-w-[1800px] px-5 sm:px-8">
				{images.length === 0 ? (
					<EmptyState />
				) : (
					<>
						<div className="reveal mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-stone-400">
							<span className="h-px flex-1 bg-zinc-800" />
							Latest signals
							<span className="h-px flex-1 bg-zinc-800" />
						</div>
						<div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
							{images.map((image, i) => (
								<GalleryTile
									key={image.id}
									image={image}
									index={i}
									priority={i === 0}
								/>
							))}
						</div>
					</>
				)}
			</main>

			<Footer />
		</>
	);
}

function GalleryTile({ image, index, priority }) {
	return (
		<Link
			href={`/w/${encodePublicId(image.public_id)}`}
			aria-label={`View wallpaper: ${image.title}`}
			className="group reveal block outline-none"
			style={{ animationDelay: `${Math.min(index, 10) * 55}ms` }}
		>
			{/* Uniform 9:16 crop so every grid tile is the same size and rows stay even. */}
			<div className="relative overflow-hidden border border-zinc-800/80 bg-zinc-950 transition-colors duration-200 group-hover:border-accent group-focus-visible:border-accent">
				<GlitchImage
					src={cldUrl(image.public_id, image.format, "c_fill,w_720,h_1280")}
					blurDataURL={cldUrl(
						image.public_id,
						image.format,
						"c_fill,w_720,h_1280,e_blur:2000,q_1"
					)}
					alt={image.alt}
					width={720}
					height={1280}
					className="w-full"
					priority={priority}
				/>
				<span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-2 bg-black/85 px-2.5 py-2 text-[10px] uppercase tracking-[0.25em] text-bone transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0">
				<span className="truncate">
						{image.title}
					</span>
					<span aria-hidden="true" className="text-accent">
						↗
					</span>
				</span>
			</div>
		</Link>
	);
}

function EmptyState() {
	return (
		<div className="reveal flex flex-col items-center gap-6 py-24 text-center">
			<p className="font-display glitch-text text-5xl uppercase tracking-tight text-stone-500 sm:text-7xl">
				{"// No signal"}
			</p>
			<div className="flex w-full max-w-md items-center gap-4">
				<span className="h-px flex-1 bg-zinc-800" />
				<span className="h-2 w-2 rounded-full bg-accent" />
				<span className="h-px flex-1 bg-zinc-800" />
			</div>
			<p className="text-sm uppercase tracking-[0.3em] text-stone-400">
				Transmission dropped — new signals incoming.
			</p>
		</div>
	);
}

export async function getStaticProps() {
	const images = await getImages();
	return { props: { images } };
}
