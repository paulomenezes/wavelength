"use client";

import {
	AlertCircleIcon,
	ArrowDownToLineIcon,
	HeadphonesIcon,
	Loader2Icon,
	MessageSquareTextIcon,
	PauseIcon,
	PlayIcon,
	RotateCcwIcon,
	RotateCwIcon,
	Volume2Icon,
	VolumeXIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useAudioPlayer } from "~/contexts/audio-player-context";
import { formatTime } from "~/utils/functions";
import { Button } from "./ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
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
		wordsRef,
		containerScrolledRef,
		currentTranscript,
		currentTranscriptIsLoading,
		playbackRate,
		changePlaybackRate,
		requestTranscript,
	} = useAudioPlayer();

	const [isExpanded, setIsExpanded] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [volume, setVolume] = useState(100);
	const [imageError, setImageError] = useState(false);

	// Skip forward 30/10 seconds
	const skipForward = useCallback(() => {
		if (audioRef.current) {
			const skipAmount = 30;
			const newTime = Math.min(currentTime + skipAmount, duration);
			seekTo(newTime);
		}
	}, [currentTime, duration, seekTo, audioRef.current]);

	// Skip back 15/5 seconds
	const skipBack = useCallback(() => {
		if (audioRef.current) {
			const skipAmount = 15;
			const newTime = Math.max(currentTime - skipAmount, 0);
			seekTo(newTime);
		}
	}, [currentTime, seekTo, audioRef.current]);

	// Handle volume change
	const handleVolumeChange = useCallback(
		(value: number[]) => {
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
		},
		[isMuted, audioRef.current],
	);

	// Toggle mute
	const toggleMute = useCallback(() => {
		if (audioRef.current) {
			const newMuteState = !isMuted;
			audioRef.current.muted = newMuteState;
			setIsMuted(newMuteState);
		}
	}, [isMuted, audioRef.current]);

	useEffect(() => {
		if (currentEpisode) {
			setIsExpanded(false);
		}
	}, [currentEpisode]);

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
				<div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
					{/* Podcast/Summary image and info - hidden on mobile */}
					<div className="mr-auto hidden w-1/5 items-center gap-3 md:flex">
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
					<div className="flex w-full flex-col gap-2 md:w-2/5">
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

					<div className="ml-auto flex w-full items-center justify-center gap-2 md:w-1/5 md:justify-end">
						<Button
							type="button"
							onClick={() => {
								setIsExpanded((prev) => !prev);

								if (!currentTranscript || currentTranscript?.length === 0) {
									requestTranscript();
								}
							}}
							title={isExpanded ? "Hide transcript" : "Show transcript"}
							disabled={currentTranscriptIsLoading}
							variant={isExpanded ? "default" : "outline"}
							size="icon"
						>
							{currentTranscriptIsLoading ? (
								<Loader2Icon className="h-5 w-5 animate-spin" />
							) : (
								<MessageSquareTextIcon className="h-5 w-5" />
							)}
						</Button>

						<Select
							value={playbackRate.toString()}
							onValueChange={(value) => {
								const newRate = Number.parseFloat(value);
								changePlaybackRate(newRate);
							}}
						>
							<SelectTrigger
								hideChevron
								className="w-16 justify-center rounded-full"
							>
								<SelectValue placeholder="Speed" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="0.5">0.5x</SelectItem>
								<SelectItem value="1">1x</SelectItem>
								<SelectItem value="1.5">1.5x</SelectItem>
								<SelectItem value="2">2x</SelectItem>
							</SelectContent>
						</Select>

						{/* Volume control - hidden on mobile */}
						<div className="hidden flex-1 items-center justify-end gap-2 md:flex">
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
								className="w-24 lg:w-44"
							/>
						</div>
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
						className="relative overflow-hidden border-gray-200 border-t bg-primary text-white"
					>
						<div
							className="h-full overflow-y-auto px-4 py-3"
							style={{ maxHeight: "200px" }}
							onWheel={() => {
								containerScrolledRef.current = true;
							}}
						>
							{currentTranscriptIsLoading ? (
								<div className="flex h-full items-center justify-center">
									<Loader2Icon className="h-5 w-5 animate-spin" />
								</div>
							) : (
								<div className="mx-auto max-w-4xl space-y-2" ref={wordsRef}>
									{currentTranscript?.map((segment) => (
										<div
											key={segment.id}
											id={`transcript-${segment.id}`}
											className="group cursor-pointer"
										>
											<p className="text-base text-gray-400 leading-relaxed transition-all duration-300 group-data-[active=true]:font-medium group-data-[active=true]:text-white">
												{segment.data}
											</p>
										</div>
									))}
								</div>
							)}
						</div>

						<Button
							variant="ghost"
							size="icon"
							className="absolute right-3 bottom-3"
							onClick={() => {
								containerScrolledRef.current = false;
							}}
						>
							<ArrowDownToLineIcon className="h-5 w-5" />
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
