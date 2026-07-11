// Runnable check for the ambient glitch timing logic. No framework:
//   node tests/glitchSchedule.test.mjs
import assert from "node:assert/strict";
import { pickDelay, randomRange } from "../lib/glitchSchedule.mjs";

// pickDelay stays within [min, max) and tracks rand()
assert.equal(pickDelay(1000, 5000, () => 0), 1000);
assert.equal(pickDelay(1000, 5000, () => 0.5), 3000);
assert.ok(pickDelay(1000, 5000, () => 0.999) < 5000);

// randomRange: min < max and both stay inside the intended envelope
const lo = randomRange(() => 0);
assert.equal(lo.min, 2500);
assert.equal(lo.max, 6500);

const hi = randomRange(() => 1);
assert.ok(hi.min < hi.max);
assert.ok(hi.min <= 5500 && hi.max <= 17500);

console.log("glitchSchedule: all checks passed");
