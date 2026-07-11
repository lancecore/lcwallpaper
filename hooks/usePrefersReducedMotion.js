import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// SSR-safe: false on the server + first client paint (no flash of "reduced"),
// then syncs on mount and stays live if the user toggles the OS setting.
export default function usePrefersReducedMotion() {
	const [reduce, setReduce] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia(QUERY);
		const update = () => setReduce(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	return reduce;
}
