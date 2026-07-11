import { useRef } from "react";
import Image from "next/image";
import { useGlitch } from "react-powerglitch";
import useAmbientGlitch from "@/hooks/useAmbientGlitch";
import { randomRange } from "@/lib/glitchSchedule.mjs";

// One glitch instance per image so it can be triggered independently (hover on
// desktop + ambient random firing on all devices via useAmbientGlitch).
const HOVER_GLITCH = {
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
};

export default function GlitchImage({
	src,
	alt,
	width,
	height,
	blurDataURL,
	className,
	priority,
}) {
	const glitch = useGlitch(HOVER_GLITCH);
	const wrapperRef = useRef(null);
	const rangeRef = useRef(null);
	if (!rangeRef.current) rangeRef.current = randomRange();
	useAmbientGlitch(glitch, wrapperRef, rangeRef.current);

	return (
		<div ref={wrapperRef}>
			{/* Plain next/image: src is already a full Cloudinary URL from cldUrl().
			    With images.unoptimized it renders verbatim — CldImage would wrap the
			    URL in a second transform and 404. */}
			<Image
				ref={glitch.ref}
				src={src}
				alt={alt}
				width={width}
				height={height}
				placeholder="blur"
				blurDataURL={blurDataURL}
				className={className}
				priority={priority}
				style={{ transform: "translate3d(0, 0, 0)" }}
			/>
		</div>
	);
}
