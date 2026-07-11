import "@/styles/globals.css";
import Script from "next/script";
import { Anton } from "next/font/google";

const anton = Anton({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-anton",
	display: "swap",
});

export default function App({ Component, pageProps }) {
	return (
		<div className={anton.variable}>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-void focus:px-4 focus:py-2 focus:text-sm focus:uppercase focus:tracking-[0.2em] focus:text-bone focus:outline focus:outline-2 focus:outline-accent"
			>
				Skip to content
			</a>
			{/* Load the Google Analytics script */}
			<Script
				strategy="afterInteractive"
				src="https://www.googletagmanager.com/gtag/js?id=G-8DVK37WT0E"
			/>
			{/* Initialize GA */}
			<Script
				id="gtag-init"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8DVK37WT0E', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
			<Component {...pageProps} />
		</div>
	);
}
