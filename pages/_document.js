import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link
					rel="icon"
					type="image/png"
					href="/favicon.png"
					media="(prefers-color-scheme: light)"
				/>
				<link
					rel="icon"
					type="image/png"
					href="/favicon-dark.png"
					media="(prefers-color-scheme: dark)"
				/>
				<meta
					name="description"
					content="Weird wallpapers for your phone"
				/>
				<meta
					property="og:description"
					content="Download some weird wallpapers for your phone"
				/>
			</Head>
			<body className="antialiased">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
