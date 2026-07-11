// Pure timing helpers for the ambient glitch scheduler — no DOM, unit-testable.
// `.mjs` so it loads as ESM both inside Next and from a plain `node` test run.

// A delay in [minDelay, maxDelay). `rand` is injectable for tests.
export function pickDelay(minDelay, maxDelay, rand = Math.random) {
	return minDelay + rand() * (maxDelay - minDelay);
}

// A per-image cadence so the grid's glitches feel organic instead of one uniform
// pulse — some images flicker often, some rarely.
export function randomRange(rand = Math.random) {
	const min = 2500 + rand() * 3000; // 2.5–5.5s
	const max = min + 4000 + rand() * 8000; // +4–12s
	return { min, max };
}
