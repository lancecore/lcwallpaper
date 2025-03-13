import Head from "next/head";
import Link from "next/link";
import cloudinary from "cloudinary";
import { CldImage } from "next-cloudinary";
import { useGlitch } from "react-powerglitch";
import Logo from "@/components/Logo";

export default function Home({ images = [] }) {
	const [mostRecentImage, ...restImages] = images;

	// Click tracking function
	const handleImageClick = (label) => {
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("event", "click", {
				event_category: "Image",
				event_label: label,
			});
		}
	};

	const logoGlitch = useGlitch({
		playMode: "always",
		createContainers: true,
		hideOverflow: true,
		timing: { duration: 2500 },
		glitchTimeSpan: { start: 0.1, end: 0.25 },
		shake: { velocity: 25, amplitudeX: 0.1, amplitudeY: 0.15 },
		slice: {
			count: 8,
			velocity: 8,
			minHeight: 0.02,
			maxHeight: 0.2,
			hueRotate: true,
		},
		pulse: false,
	});

	const hoverGlitch = useGlitch({
		playMode: "hover",
		createContainers: true,
		hideOverflow: true,
		timing: { duration: 250, iterations: 1 },
		glitchTimeSpan: { start: 0, end: 1 },
		shake: false,
		slice: {
			count: 6,
			velocity: 15,
			minHeight: 0.02,
			maxHeight: 0.15,
			hueRotate: true,
		},
		pulse: false,
	});

	const nameGlitch = useGlitch({
		playMode: "hover",
		createContainers: true,
		hideOverflow: false,
		timing: { duration: 250, iterations: 1 },
		glitchTimeSpan: { start: 0, end: 1 },
		shake: { velocity: 15, amplitudeX: 0.2, amplitudeY: 0.2 },
		slice: {
			count: 6,
			velocity: 15,
			minHeight: 0.02,
			maxHeight: 0.15,
			hueRotate: true,
		},
		pulse: false,
	});

	return (
		<>
			<Head>
				<title>⚡️Lancecore: Weird Wallpapers for your Phone</title>
			</Head>
			<main className="mx-auto max-w-[1960px]">
				<div className="columns-1 gap-4 md:columns-5">
					<div className="after:content relative mb-5 flex h-auto flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-zinc-900/60 px-6 py-12 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight border border border-zinc-800/50">
						<span ref={logoGlitch.ref}>
							<Logo className="h-24 w-auto" />
						</span>
						<h1 className="mb-4 mt-8 text-lg font-bold uppercase tracking-widest">
							Weird Wallpapers
							<br />
							for your Phone
						</h1>
						<p className="text-sm text-stone-400">
							Created by{" "}
							<a
								href="https://lanceboer.com/"
								target="_blank"
								ref={nameGlitch.ref}
								className="text-stone-300 underline decoration-stone-400 decoration-solid underline-offset-4 hover:text-stone-50 hover:decoration-wavy"
							>
								Lance Boer
							</a>
						</p>
						<p className="text-sm text-stone-400">
							Previously on...{" "}
							<a
								href="https://bastards.tumblr.com/"
								target="_blank"
								ref={nameGlitch.ref}
								className="text-stone-300 underline decoration-stone-400 decoration-solid underline-offset-4 hover:text-stone-50 hover:decoration-wavy"
							>
								Stand Up For Bastards
							</a>
						</p>
					</div>
					{mostRecentImage && (
						<div className="grid-area-featured mb-4">
							<Link
								href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${mostRecentImage.public_id}.${mostRecentImage.format}`}
								className="block w-full cursor-zoom-in"
								onClick={() =>
									handleImageClick(mostRecentImage.public_id)
								}
							>
								<CldImage
									alt={mostRecentImage.alt}
									className="w-auto h-full rounded-lg object-cover"
									style={{
										transform: "translate3d(0, 0, 0)",
									}}
									ref={hoverGlitch.ref}
									src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_1080/${mostRecentImage.public_id}.${mostRecentImage.format}`}
									width={1080}
									height={720}
									placeholder="blur"
									blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_blur:2000,q_1/${mostRecentImage.public_id}.${mostRecentImage.format}`}
								/>
							</Link>
						</div>
					)}
					{restImages.map(({ id, public_id, format, alt }) => (
						<div
							key={id}
							className="grid-area-item h-full mb-4"
						>
							<Link
								href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}.${format}`}
								className="block w-auto cursor-zoom-in h-full"
								onClick={() => handleImageClick(public_id)}
							>
								<CldImage
									alt={alt}
									className="w-auto h-full rounded-lg object-cover"
									style={{
										transform: "translate3d(0, 0, 0)",
									}}
									ref={hoverGlitch.ref}
									src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
									width={720}
									height={480}
									placeholder="blur"
									blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_blur:2000,q_1/${public_id}.${format}`}
								/>
							</Link>
						</div>
					))}
				</div>
			</main>
		</>
	);
}

export async function getStaticProps() {
	cloudinary.config({
		cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	const results = await cloudinary.v2.search
		.expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
		.with_field("context")
		.sort_by("created_at", "desc")
		.max_results(400)
		.execute();

	console.log("Cloudinary search results:", results);

	let reducedResults = [];
	if (results.resources) {
		let i = 0;
		for (let result of results.resources) {
			reducedResults.push({
				id: i,
				height: result.height,
				width: result.width,
				public_id: result.public_id,
				format: result.format,
				alt:
					result.context && result.context.alt
						? result.context.alt
						: "Weird Wallpaper",
			});
			i++;
		}
	}

	return {
		props: {
			images: reducedResults,
		},
	};
}
