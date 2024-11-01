import { type ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce, useResizeObserver } from "./hooks.js";

export type FitterProps = {
	/**
	 * The content to fit.
	 */
	children: ReactNode;
	/**
	 * The minimum scale that the text will shrink to. E.g. 0.25 means the text
	 * will shrink to no less than 25% of its original size.
	 */
	minSize?: number;
	/**
	 * The maximum number of lines that the text will shrink to fit.
	 */
	maxLines?: number;
	/**
	 * The precision at which the text will settle. The component finds the best
	 * size by halving the difference between the current size and the min/max
	 * size. If the difference is less than the settle precision, the component
	 * will stop and settle on that size. A value of 0.01 means the component will
	 * settle when the difference is less than 1%.
	 */
	settlePrecision?: number;
	/**
	 * Whether to update the text size when the size of the component changes.
	 */
	updateOnSizeChange?: boolean;
	/**
	 * The time to wait before updating the text size when the size of the
	 * component changes. This is useful when the component is being resized
	 * frequently and you want to avoid updating the text size on every resize
	 * event.
	 */
	resizeDebounceTime?: number;
};

/**
 * A utility component that fits text to a container by finding the best text
 * size through binary search. The text will never grow larger than the original
 * size and will shrink to fit the container.
 */
export const Fitter = ({
	children,
	minSize = 0.25,
	maxLines = 1,
	settlePrecision = 0.01,
	updateOnSizeChange = true,
	resizeDebounceTime = 100,
}: FitterProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLSpanElement>(null);

	const [size, setSize] = useState(1);
	const [settled, setSettled] = useState(false);
	const [targetMax, setTargetMax] = useState(1);

	useEffect(() => {
		if (settled) return;
		if (!textRef.current) throw new Error("Could not access wrapper ref");

		const lines = textRef.current.getClientRects().length;

		const nextShrinkStep = (size - minSize) / 2;
		const nextGrowStep = (targetMax - size) / 2;

		const nextShrinkSize = size - nextShrinkStep;
		const nextGrowSize = size + nextGrowStep;

		const wantsToShrink = lines > maxLines;

		if (wantsToShrink) {
			if (nextShrinkStep < settlePrecision) {
				setSettled(true);
				return;
			}

			setTargetMax(size);
			setSize(nextShrinkSize);
			return;
		}

		if (nextGrowStep < settlePrecision) {
			setSettled(true);
			return;
		}

		setSize(nextGrowSize);
	}, [size, maxLines, minSize, targetMax, settlePrecision, settled]);

	const start = useDebounce(() => {
		setTargetMax(1);
		setSettled(false);
	}, resizeDebounceTime);

	useResizeObserver(wrapperRef, () => start(), updateOnSizeChange);

	return (
		<div
			ref={wrapperRef}
			className="react-fitter__wrapper"
			style={{
				lineHeight: 0,
			}}
		>
			<span
				ref={textRef}
				style={{
					fontSize: `${size * 100}%`,
					lineHeight: 1,
				}}
				className="react-fitter__text"
			>
				{children}
			</span>
		</div>
	);
};
