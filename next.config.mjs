/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	distDir: ".next",
	// output: "export",
	// trailingSlash: true,
	// basePath: "/wallpaper/build",
	images: {
		unoptimized: true,
		loader: "imgix",
		path: "",
	},
};

export default nextConfig;
