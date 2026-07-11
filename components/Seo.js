import Head from "next/head";
import { absUrl } from "@/lib/siteUrl";

// Single source of truth for per-page meta: title, description, canonical, and
// the Open Graph / Twitter card. Every page passes its own `description` so no two
// pages share one (the old global <meta name="description"> is gone from _document).
export default function Seo({
	title,
	description,
	path = "/",
	image,
	imageAlt,
	imageWidth,
	imageHeight,
	type = "website",
}) {
	const url = absUrl(path);

	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={url} />

			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={type} />
			<meta property="og:url" content={url} />
			{image && <meta property="og:image" content={image} />}
			{image && imageWidth && (
				<meta property="og:image:width" content={String(imageWidth)} />
			)}
			{image && imageHeight && (
				<meta property="og:image:height" content={String(imageHeight)} />
			)}
			{image && imageAlt && (
				<meta property="og:image:alt" content={imageAlt} />
			)}

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			{image && <meta name="twitter:image" content={image} />}
			{image && imageAlt && (
				<meta name="twitter:image:alt" content={imageAlt} />
			)}
		</Head>
	);
}
