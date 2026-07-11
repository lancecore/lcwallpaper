import { useGlitch } from "react-powerglitch";
import Logo from "@/components/Logo";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const LOGO_GLITCH = {
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
};

export default function Hero({ count }) {
	const reduce = usePrefersReducedMotion();
	const logoGlitch = useGlitch(LOGO_GLITCH);

	return (
		<header className="reveal mx-auto w-full max-w-[1800px] px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
			<div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.45em] text-stone-400">
				<span
					className="inline-block h-2 w-2 rounded-full bg-accent motion-safe:animate-pulse"
					aria-hidden="true"
				/>
				Transmission · Lancecore
			</div>

			<div className="mt-6 flex flex-col-reverse gap-6 sm:flex-row sm:items-end sm:justify-between">
				<h1 className="font-display glitch-text text-[clamp(3rem,13vw,9rem)] leading-[0.82] tracking-tight text-bone">
					WEIRD
					<br />
					WALLPAPERS
				</h1>
				<span
					ref={reduce ? undefined : logoGlitch.ref}
					className="text-accent"
				>
					<Logo className="h-16 w-auto sm:h-28" />
				</span>
			</div>

			<div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-4 text-[11px] uppercase tracking-[0.3em] text-stone-400">
				<span>For your phone</span>
				<span>
					{count} {count === 1 ? "signal" : "signals"}
				</span>
			</div>
		</header>
	);
}
