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
import type { RSSBasicEpisode } from "~/types/rss-episode";
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
	const lastUpdateTime = useRef(0);

	const { mutateAsync: getListeningHistoryByEpisodeUuid } =
		api.queue.getListeningHistoryByEpisodeUuid.useMutation();

	const { mutateAsync: updateListeningHistory } =
		api.queue.updateListeningHistory.useMutation({});

	const { mutateAsync: markAsListened } =
		api.queue.markAsListened.useMutation();

	const {
		data: currentTranscript,
		mutate: getTranscript,
		isPending: transcriptIsLoading,
	} = api.transcription.getTranscript.useMutation();

	const { data: queue } = api.queue.getQueue.useQuery();

	useEffect(() => {
		if (queue && queue.length > 0) {
			const nextEpisode = queue[0];

			if (nextEpisode) {
				playEpisode(nextEpisode.episode, nextEpisode.podcast, true);
			}
		}
	}, [queue]);

	useEffect(() => {
		if (
			currentEpisode?.uuid &&
			Math.abs(currentTime - lastUpdateTime.current) > 10 &&
			duration > 0
		) {
			console.log("updating listening history 1", { currentTime, duration });
			updateListeningHistory({
				episodeUuid: currentEpisode.uuid,
				progress: currentTime,
				duration,
			});

			lastUpdateTime.current = currentTime;
		} else if (
			currentEpisode?.uuid &&
			currentTime >= duration &&
			duration > 0
		) {
			markAsListened({
				episodeUuid: currentEpisode.uuid,
			});

			const nextEpisode = queue?.find(
				(item) => item.episode_uuid !== currentEpisode.uuid,
			);

			if (nextEpisode) {
				playEpisode(nextEpisode.episode, nextEpisode.podcast);
			}
		}
	}, [
		currentTime,
		currentEpisode?.uuid,
		updateListeningHistory,
		duration,
		markAsListened,
		queue,
	]);

	useEffect(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio();

			audioRef.current.addEventListener("loadedmetadata", () => {
				setDuration(audioRef.current?.duration || 0);
				setAudioError(null);
			});

			audioRef.current.addEventListener("timeupdate", () => {
				const currentTime = audioRef.current?.currentTime || 0;
				setCurrentTime(currentTime);
			});

			audioRef.current.addEventListener("ended", () => {
				setIsPlaying(false);
			});

			audioRef.current.addEventListener("error", (e) => {
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
		async (
			episode: RSSBasicEpisode,
			podcast: PodcastSeries,
			fromLoad = false,
		) => {
			if (audioRef.current) {
				setAudioError(null);

				const url = episode.enclosures[0]?.url;

				if (currentEpisode?.id === episode.id) {
					if (isPlaying) {
						audioRef.current.pause();
						setIsPlaying(false);

						console.log("updating listening history 2", {
							currentTime,
							duration,
						});
						updateListeningHistory({
							episodeUuid: currentEpisode.uuid,
							progress: currentTime,
							duration,
						});
					} else {
						audioRef.current.play().catch((error) => {
							setAudioError("Failed to play audio. Please try again.");
						});
						setIsPlaying(true);
					}
				} else if (url && podcast.uuid) {
					const listeningHistory = await getListeningHistoryByEpisodeUuid({
						episodeUuid: episode.uuid,
					});

					let newCurrentTime = 0;

					if (listeningHistory?.progress) {
						newCurrentTime = listeningHistory.progress;
					} else {
						newCurrentTime = 0;
					}

					audioRef.current.src = url;
					audioRef.current.load();

					if (!fromLoad) {
						audioRef.current.play().catch((error) => {
							setAudioError("Failed to play audio. Please try again.");
						});
						setIsPlaying(true);
					}
					setTimeout(() => {
						seekTo(newCurrentTime);
					}, 100);
					setCurrentEpisode(episode);
					setCurrentTime(newCurrentTime);
					setPodcast(podcast);

					getTranscript({
						podcastId: podcast.uuid,
						episodeId: episode.uuid,
						url,
					});
				}
			}
		},
		[
			isPlaying,
			currentEpisode?.id,
			getTranscript,
			getListeningHistoryByEpisodeUuid,
			updateListeningHistory,
			currentTime,
			duration,
			currentEpisode?.uuid,
		],
	);

	const togglePlayPause = useCallback(() => {
		if (!audioRef.current) {
			return;
		}

		if (isPlaying) {
			audioRef.current.pause();

			if (currentEpisode?.uuid) {
				console.log("updating listening history 3", {
					currentTime,
					duration,
				});
				updateListeningHistory({
					episodeUuid: currentEpisode.uuid,
					progress: currentTime,
					duration,
				});
			}
		} else {
			audioRef.current.play().catch((error) => {
				setAudioError("Failed to play audio. Please try again.");
			});
		}

		setIsPlaying(!isPlaying);
	}, [
		isPlaying,
		currentEpisode?.uuid,
		currentTime,
		duration,
		updateListeningHistory,
	]);

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
