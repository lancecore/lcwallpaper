import "@/styles/globals.css";
import Script from "next/script";

export default function App({ Component, pageProps }) {
	return (
		<>
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
		</>
	);
}
