"use client";

import type React from "react";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

// Placeholder texts to rotate through
const placeholders = [
	"Search for podcasts about technology...",
	"Find true crime podcasts...",
	"Ask for podcast recommendations...",
	"Discover podcasts with short episodes...",
	"Search for podcasts by topic or host...",
];

export function PlaceholdersAndVanishInput({
	onChange,
	onSubmit,
	value,
	disabled = false,
	className,
	inputClassName,
	showSparkle = false,
	onFocus,
	onBlur,
	isOpen = false,
	inputRef,
}: {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	value: string;
	disabled?: boolean;
	className?: string;
	inputClassName?: string;
	showSparkle?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	isOpen?: boolean;
	inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
	const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const startAnimation = useCallback(() => {
		intervalRef.current = setInterval(() => {
			setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
		}, 3000);
	}, []);

	const handleVisibilityChange = useCallback(() => {
		if (document.visibilityState !== "visible" && intervalRef.current) {
			clearInterval(intervalRef.current); // Clear the interval when the tab is not visible
			intervalRef.current = null;
		} else if (document.visibilityState === "visible") {
			startAnimation(); // Restart the interval when the tab becomes visible
		}
	}, [startAnimation]);

	useEffect(() => {
		startAnimation();
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [handleVisibilityChange, startAnimation]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!disabled && value) {
			onSubmit?.(e);
		}
	};

	return (
		<form
			className={cn(
				"relative h-12 w-full overflow-hidden rounded-full border bg-background shadow-md transition duration-200",
				value && "bg-white dark:bg-zinc-800/50",
				isOpen ? "rounded-lg" : "rounded-[30px]",
				className,
			)}
			onSubmit={handleSubmit}
		>
			{showSparkle && (
				<span className="-translate-y-1/2 absolute top-1/2 left-4 transform text-primary">
					✨
				</span>
			)}

			<input
				onChange={onChange}
				ref={inputRef}
				value={value}
				type="text"
				disabled={disabled}
				onFocus={onFocus}
				onBlur={onBlur}
				className={cn(
					"relative z-50 h-full w-full rounded-full border-none bg-transparent text-sm focus:outline-none focus:ring-0 sm:text-base",
					showSparkle ? "pl-10" : "pl-4 sm:pl-10",
					value ? "pr-3" : "pr-12", // Reduced right padding since we removed the button
					inputClassName,
				)}
			/>

			<div className="pointer-events-none absolute inset-0 flex items-center rounded-full">
				<AnimatePresence mode="wait">
					{!value && (
						<motion.p
							initial={{
								y: 5,
								opacity: 0,
							}}
							key={`current-placeholder-${currentPlaceholder}`}
							animate={{
								y: 0,
								opacity: 1,
							}}
							exit={{
								y: -15,
								opacity: 0,
							}}
							transition={{
								duration: 0.3,
								ease: "linear",
							}}
							className={cn(
								"w-[calc(100%-2rem)] truncate text-left font-normal text-neutral-500 text-sm sm:text-base dark:text-zinc-500",
								showSparkle ? "pl-10" : "pl-4 sm:pl-12",
							)}
						>
							{placeholders[currentPlaceholder]}
						</motion.p>
					)}
				</AnimatePresence>
			</div>
		</form>
	);
}
