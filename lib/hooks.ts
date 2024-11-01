import {
	type RefObject,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react";

const debounce = (callback: () => void, delay: number) => {
	let timeout: NodeJS.Timeout;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(callback, delay);
	};
};

export const useDebounce = <T extends unknown[], U>(
	callback: (...args: T) => U,
	delay: number,
) => {
	const callbackRef = useRef(callback);
	useLayoutEffect(() => {
		callbackRef.current = callback;
	});
	return useMemo(
		() => debounce((...args: T) => callbackRef.current(...args), delay),
		[delay],
	);
};

export const useResizeObserver = (
	ref: RefObject<HTMLSpanElement>,
	callback: () => void,
	enabled: boolean,
) => {
	const width = useRef(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Using a ref as a dependency doesn't work as	expected.
	useEffect(() => {
		if (!ref.current) return;
		if (!enabled) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				// Some older browsers don't return contentBoxSize
				const newWidth = entry.contentBoxSize
					? entry.contentBoxSize[0].inlineSize
					: entry.contentRect.width;

				if (newWidth !== width.current) {
					width.current = newWidth;
					callback();
				}
			}
		});

		observer.observe(ref.current);

		return () => {
			observer.disconnect();
		};
	}, [enabled]);
};
