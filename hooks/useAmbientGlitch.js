import { useEffect, useRef } from "react";
import { pickDelay } from "@/lib/glitchSchedule.mjs";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const BLIP_MS = 250; // matches the glitch timing.duration

// Fires random one-shot glitches on this image at random intervals, on every device.
// ponytail: self-scheduling per image + viewport-gated, so ~400 images stay cheap
// (only on-screen images ever animate). Stops live when prefers-reduced-motion flips on.
export default function useAmbientGlitch(glitch, targetRef, range) {
	const reduce = usePrefersReducedMotion();
	const glitchRef = useRef(glitch);
	glitchRef.current = glitch;
	const rangeRef = useRef(range);
	rangeRef.current = range;

	useEffect(() => {
		if (reduce) return;
		const el = targetRef.current;
		if (!el) return;

		let visible = false;
		let timer;
		let stopTimer;

		const blip = () => {
			glitchRef.current.startGlitch();
			stopTimer = setTimeout(
				() => glitchRef.current.stopGlitch(),
				BLIP_MS
			);
		};

		const schedule = () => {
			const { min, max } = rangeRef.current;
			timer = setTimeout(() => {
				if (visible) blip();
				schedule();
			}, pickDelay(min, max));
		};

		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{ rootMargin: "150px" }
		);
		io.observe(el);
		schedule();

		return () => {
			clearTimeout(timer);
			clearTimeout(stopTimer);
			io.disconnect();
		};
	}, [targetRef, reduce]);
}
