"use client";

import type React from "react";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { DialogTrigger } from "./ui/dialog";

export function HomepageChatTrigger() {
	const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

	const placeholders = [
		"Search for podcasts about technology...",
		"Find true crime podcasts...",
		"Ask for podcast recommendations...",
		"Discover podcasts with short episodes...",
		"Search for podcasts by topic or host...",
	];

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

	return (
		<DialogTrigger asChild>
			<button
				type="button"
				className={cn(
					"relative mx-4 mt-12 h-12 w-full overflow-hidden rounded-full border bg-background px-4 shadow-md transition duration-200 lg:mx-auto lg:max-w-4xl",
				)}
			>
				<span className="-translate-y-1/2 absolute top-1/2 left-4 transform text-primary">
					✨
				</span>

				<div
					className={cn(
						"relative z-50 h-full w-full cursor-pointer rounded-full border-none bg-transparent text-sm focus:outline-none focus:ring-0 sm:text-base",
						"pl-10",
					)}
				/>

				<kbd className="-translate-y-1/2 absolute top-1/2 right-4 inline-flex h-5 transform select-none items-center gap-1 rounded-full border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
					<span className="pt-[0.5px] text-xs">⌘</span>K
				</kbd>

				<div className="pointer-events-none absolute inset-0 flex items-center rounded-full">
					<AnimatePresence mode="wait">
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
								"pl-10",
							)}
						>
							{placeholders[0]}
						</motion.p>
					</AnimatePresence>
				</div>
			</button>
		</DialogTrigger>
	);
}
