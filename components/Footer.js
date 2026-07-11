import { useGlitch } from "react-powerglitch";

const NAME_GLITCH = {
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
};

const LINK =
	"text-bone underline decoration-stone-600 underline-offset-4 outline-none hover:decoration-accent hover:decoration-wavy focus-visible:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function Footer() {
	const nameGlitch = useGlitch(NAME_GLITCH);
	const bastardsGlitch = useGlitch(NAME_GLITCH);

	return (
		<footer className="reveal mx-auto mt-16 w-full max-w-[1800px] px-5 pb-16 sm:px-8">
			<div className="border-t border-zinc-800 pt-6">
				<p className="inline-block origin-left -rotate-1 font-display text-3xl uppercase tracking-[0.25em] text-stone-500 sm:text-4xl">
					{"// End of transmission"}
				</p>
				<div className="mt-5 flex flex-col gap-1.5 text-sm text-stone-400 sm:flex-row sm:gap-8">
					<p>
						Created by{" "}
						<a
							ref={nameGlitch.ref}
							href="https://lanceboer.com/"
							target="_blank"
							rel="noreferrer"
							className={LINK}
						>
							Lance Boer
							<span className="sr-only"> (opens in new tab)</span>
						</a>
					</p>
					<p>
						Previously on...{" "}
						<a
							ref={bastardsGlitch.ref}
							href="https://bastards.tumblr.com/"
							target="_blank"
							rel="noreferrer"
							className={LINK}
						>
							Stand Up For Bastards
							<span className="sr-only"> (opens in new tab)</span>
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
