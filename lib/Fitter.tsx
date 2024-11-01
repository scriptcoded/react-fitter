import { type ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce, useResizeObserver } from "./hooks.js";

export type FitterProps = {
	children: ReactNode;
	minSize?: number;
	maxLines?: number;
	settlePrecision?: number;
	updateOnSizeChange?: boolean;
	windowResizeDebounce?: number;
};

export const Fitter = ({
	children,
	minSize = 0.25,
	maxLines = 1,
	settlePrecision = 0.01,
	updateOnSizeChange = true,
	windowResizeDebounce = 100,
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
	}, windowResizeDebounce);

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
