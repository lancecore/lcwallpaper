/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	distDir: "build",
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
