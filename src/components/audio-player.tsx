"use client";

import * as lame from "@breezystack/lamejs";
import {
	AlertCircleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	HeadphonesIcon,
	Loader2Icon,
	PauseIcon,
	PlayIcon,
	RotateCcwIcon,
	RotateCwIcon,
	Volume2Icon,
	VolumeXIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAudioPlayer } from "~/contexts/audio-player-context";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { formatTime } from "~/utils/functions";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

export function AudioPlayer() {
	const {
		currentEpisode,
		isPlaying,
		duration,
		currentTime,
		togglePlayPause,
		seekTo,
		podcast,
		audioError,
		audioRef,
		currentTranscript,
		currentTranscriptIsLoading,
	} = useAudioPlayer();

	const [isExpanded, setIsExpanded] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [volume, setVolume] = useState(100);
	const [imageError, setImageError] = useState(false);

	// useEffect(() => {
	// 	// Set initial volume and mute state when component mounts or audioRef changes
	// 	if (audioRef.current) {
	// 		audioRef.current.volume = volume / 100;
	// 		audioRef.current.muted = isMuted;
	// 	}

	// 	// Reset image error state when episode changes
	// 	setImageError(false);
	// }, [currentEpisode, audioRef]);

	// Skip forward 30/10 seconds
	const skipForward = () => {
		if (audioRef.current) {
			const skipAmount = 30;
			const newTime = Math.min(currentTime + skipAmount, duration);
			seekTo(newTime);
		}
	};

	// Skip back 15/5 seconds
	const skipBack = () => {
		if (audioRef.current) {
			const skipAmount = 15;
			const newTime = Math.max(currentTime - skipAmount, 0);
			seekTo(newTime);
		}
	};

	// Handle volume change
	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0] ?? 100;
		setVolume(newVolume);

		if (audioRef.current) {
			audioRef.current.volume = newVolume / 100;

			// Unmute if volume increased from zero
			if (newVolume > 0 && isMuted) {
				audioRef.current.muted = false;
				setIsMuted(false);
			}

			// Mute if volume reduced to zero
			if (newVolume === 0 && !isMuted) {
				audioRef.current.muted = true;
				setIsMuted(true);
			}
		}
	};

	// Toggle mute
	const toggleMute = () => {
		if (audioRef.current) {
			const newMuteState = !isMuted;
			audioRef.current.muted = newMuteState;
			setIsMuted(newMuteState);
		}
	};

	if (!currentEpisode) {
		return null;
	}

	if (audioError) {
		return (
			<div className="w-full border-t bg-background p-2 md:p-4">
				<div className="flex flex-col items-center gap-2 text-center">
					<div className="flex items-center gap-2">
						<AlertCircleIcon className="h-4 w-4 text-destructive" />
						<span className="font-medium text-destructive text-sm">
							Audio Playback Error
						</span>
					</div>
					<p className="mb-2 text-muted-foreground text-xs">{audioError}</p>
					<Button
						variant="outline"
						size="sm"
						onClick={togglePlayPause}
						className="mt-1"
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	const podcastImage = currentEpisode?.itunes_image || podcast?.imageUrl;

	return (
		<motion.div
			className="fixed right-0 bottom-0 left-0 z-40 border-t bg-background shadow-sm"
			initial={{ height: "auto" }}
			animate={{ height: isExpanded ? "auto" : "auto" }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<div className="w-full p-2 md:p-4">
				<div className="flex flex-col items-center gap-4 md:flex-row">
					{/* Podcast/Summary image and info - hidden on mobile */}
					<div className="hidden w-1/4 items-center gap-3 md:flex">
						{!imageError && podcastImage ? (
							<img
								src={podcastImage}
								alt={currentEpisode?.title || "Audio"}
								className="h-12 w-12 rounded-md object-cover"
								onError={() => {
									setImageError(true);
								}}
							/>
						) : (
							<div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
								<HeadphonesIcon className="h-5 w-5 text-primary" />
							</div>
						)}

						<div className="truncate">
							<p className="truncate font-medium text-sm">
								{currentEpisode.title}
							</p>
							<p className="truncate text-muted-foreground text-xs">
								{podcast?.name}
							</p>
						</div>
					</div>

					{/* Player controls and progress */}
					<div className="flex w-full flex-col gap-2 md:w-2/4">
						{/* Mobile episode title */}
						<div className="mb-1 text-center md:hidden">
							<p className="truncate font-medium text-sm">
								{currentEpisode?.title || "Audio"}
							</p>
						</div>

						{/* Controls */}
						<div className="flex items-center justify-center gap-2 md:gap-4">
							<Button
								variant="ghost"
								onClick={skipBack}
								className="h-8 md:h-10"
							>
								<span className="text-xs">30s</span>
								<RotateCcwIcon className="h-4 w-4 md:h-5 md:w-5" />
							</Button>

							<Button
								variant="default"
								size="icon"
								onClick={togglePlayPause}
								className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 md:h-12 md:w-12"
							>
								{isPlaying ? (
									<PauseIcon className="h-5 w-5 fill-white text-white md:h-6 md:w-6" />
								) : (
									<PlayIcon className="h-5 w-5 fill-white text-white md:h-6 md:w-6" />
								)}
							</Button>

							<Button
								variant="ghost"
								onClick={skipForward}
								className="h-8 md:h-10"
							>
								<RotateCwIcon className="h-4 w-4 md:h-5 md:w-5" />
								<span className="text-xs">30s</span>
							</Button>
						</div>

						{/* Progress bar */}
						<div className="flex items-center gap-2">
							<span className="min-w-12 font-medium text-muted-foreground text-xs">
								{formatTime(currentTime)}
							</span>

							<Slider
								value={[currentTime]}
								max={duration || 100}
								step={1}
								onValueChange={(value) => {
									const v = value[0];

									if (v) {
										seekTo(v);
									}
								}}
								className="flex-1"
							/>

							<span className="min-w-12 font-medium text-muted-foreground text-xs">
								{formatTime(duration)}
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={() => setIsExpanded((prev) => !prev)}
						className="ml-2 flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
						title={isExpanded ? "Hide transcript" : "Show transcript"}
						disabled={currentTranscriptIsLoading}
					>
						{currentTranscriptIsLoading ? (
							<Loader2Icon className="h-5 w-5 animate-spin" />
						) : isExpanded ? (
							<ChevronDownIcon className="h-5 w-5" />
						) : (
							<ChevronUpIcon className="h-5 w-5" />
						)}
					</button>

					{/* Volume control - hidden on mobile */}
					<div className="hidden w-1/4 items-center justify-end gap-2 md:flex">
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleMute}
							className="h-8 w-8"
						>
							{isMuted || volume === 0 ? (
								<VolumeXIcon className="h-4 w-4" />
							) : (
								<Volume2Icon className="h-4 w-4" />
							)}
						</Button>

						<Slider
							value={[volume]}
							min={0}
							max={100}
							step={1}
							onValueChange={handleVolumeChange}
							className="w-24"
						/>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "200px" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden border-gray-200 border-t bg-gray-900 text-white"
					>
						<div
							className="h-full overflow-y-auto px-4 py-3"
							style={{ maxHeight: "200px" }}
						>
							<div className="mx-auto max-w-4xl space-y-2">
								{currentTranscript?.map((segment, index) => (
									<div
										key={segment.id}
										id={`transcript-${segment.id}`}
										className="cursor-pointer"
									>
										<p
											className={`text-base leading-relaxed transition-colors duration-300 ${
												index === 0 ? "font-medium text-white" : "text-gray-400"
											}`}
										>
											{segment.data}
										</p>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
