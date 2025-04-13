"use client";

import type { Vector } from "@upstash/vector";
import type React from "react";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import type { PodcastSeries } from "~/graphql/generated";
import { api } from "~/trpc/react";
import type { RSSBasicEpisode, RSSEpisode } from "~/types/rss-episode";
import type { VectorDict } from "~/types/vector-dict";

interface AudioPlayerContextType {
	currentEpisode: RSSBasicEpisode | null;
	setCurrentEpisode: (episode: RSSBasicEpisode) => void;
	isPlaying: boolean;
	duration: number;
	currentTime: number;
	playEpisode: (episode: RSSBasicEpisode, podcast: PodcastSeries) => void;
	togglePlayPause: () => void;
	seekTo: (time: number) => void;
	podcast: PodcastSeries | null;
	setPodcast: (podcast: PodcastSeries) => void;
	audioError: string | null;
	audioRef: React.RefObject<HTMLAudioElement | null>;
	currentTranscript: Vector<VectorDict>[] | undefined;
	currentTranscriptIsLoading: boolean;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
	undefined,
);

export function useAudioPlayer() {
	const context = useContext(AudioPlayerContext);
	if (context === undefined) {
		throw new Error(
			"useAudioPlayer must be used within an AudioPlayerProvider",
		);
	}

	return context;
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
	const [currentEpisode, setCurrentEpisode] = useState<RSSBasicEpisode | null>(
		null,
	);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [podcast, setPodcast] = useState<PodcastSeries | null>(null);
	const [audioError, setAudioError] = useState<string | null>(null);

	const audioRef = useRef<HTMLAudioElement | null>(null);

	const {
		data: currentTranscript,
		mutate: getTranscript,
		isPending: transcriptIsLoading,
	} = api.transcription.getTranscript.useMutation();

	useEffect(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio();

			audioRef.current.addEventListener("loadedmetadata", () => {
				setDuration(audioRef.current?.duration || 0);
				setAudioError(null);
			});

			audioRef.current.addEventListener("timeupdate", () => {
				setCurrentTime(audioRef.current?.currentTime || 0);
			});

			audioRef.current.addEventListener("ended", () => {
				setIsPlaying(false);
				setCurrentTime(0);
			});

			audioRef.current.addEventListener("error", (e) => {
				console.error("Audio error:", e);
				setIsPlaying(false);
				setAudioError(
					"Failed to load audio. The file may be corrupted or in an unsupported format.",
				);
				toast.error("Error playing audio");
			});
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = "";
				audioRef.current.remove();
				audioRef.current = null;
			}
		};
	}, []);

	const playEpisode = useCallback(
		async (episode: RSSBasicEpisode, podcast: PodcastSeries) => {
			if (audioRef.current) {
				setAudioError(null);

				console.log(episode);

				const url = episode.enclosures[0]?.url;

				if (currentEpisode?.id === episode.id) {
					if (isPlaying) {
						audioRef.current.pause();
						setIsPlaying(false);
					} else {
						audioRef.current.play().catch((error) => {
							console.error("Play error:", error);
							setAudioError("Failed to play audio. Please try again.");
						});
						setIsPlaying(true);
					}
				} else if (url && podcast.uuid) {
					audioRef.current.src = url;
					audioRef.current.load();
					audioRef.current.play().catch((error) => {
						console.error("Play error:", error);
						setAudioError("Failed to play audio. Please try again.");
					});
					setIsPlaying(true);
					setCurrentEpisode(episode);
					setCurrentTime(0);
					setPodcast(podcast);

					getTranscript({
						podcastId: podcast.uuid,
						episodeId: episode.uuid,
						url,
					});
				}
			}
		},
		[isPlaying, currentEpisode?.id, getTranscript],
	);

	const togglePlayPause = useCallback(() => {
		if (!audioRef.current) {
			return;
		}

		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play().catch((error) => {
				console.error("Play error:", error);
				setAudioError("Failed to play audio. Please try again.");
			});
		}

		setIsPlaying(!isPlaying);
	}, [isPlaying]);

	const seekTo = useCallback((time: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time;
			setCurrentTime(time);
		}
	}, []);

	const value = {
		currentEpisode,
		isPlaying,
		duration,
		currentTime,
		playEpisode,
		togglePlayPause,
		seekTo,
		podcast,
		setPodcast,
		setCurrentEpisode,
		audioError,
		audioRef,
		currentTranscript,
		currentTranscriptIsLoading: transcriptIsLoading,
	};

	return (
		<AudioPlayerContext.Provider value={value}>
			{children}
		</AudioPlayerContext.Provider>
	);
}
