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
	playbackRate: number;
	changePlaybackRate: (rate: number) => void;
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
	wordsRef: React.RefObject<HTMLDivElement | null>;
	containerScrolledRef: React.RefObject<boolean>;
	currentTranscript: Vector<VectorDict>[] | undefined;
	currentTranscriptIsLoading: boolean;
	currentTranscriptRequested: boolean;
	requestTranscript: () => void;
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
	const [playbackRate, setPlaybackRate] = useState(1);
	const currentTranscriptRequested = useRef(false);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const wordsRef = useRef<HTMLDivElement | null>(null);
	const containerScrolledRef = useRef(false);
	const lastUpdateTime = useRef(0);

	const { mutateAsync: getListeningHistoryByEpisodeUuid } =
		api.queue.getListeningHistoryByEpisodeUuid.useMutation();

	const { mutateAsync: updateListeningHistory } =
		api.queue.updateListeningHistory.useMutation({});

	const { mutateAsync: markAsListened } =
		api.queue.markAsListened.useMutation();

	const {
		mutateAsync: generateTranscript,
		isPending,
		data,
	} = api.transcription.generateTranscriptAndUpsert.useMutation();

	const { data: currentTranscript, isPending: transcriptIsLoading } =
		api.transcription.getTranscript.useQuery(
			{
				podcastId: podcast?.uuid ?? "",
				episodeId: currentEpisode?.uuid ?? "",
			},
			{
				enabled: !!podcast?.uuid && !!currentEpisode?.uuid,
			},
		);

	const requestTranscript = useCallback(() => {
		if (
			podcast?.uuid &&
			currentEpisode?.uuid &&
			!currentTranscriptRequested.current
		) {
			generateTranscript({
				podcastId: podcast.uuid,
				episodeId: currentEpisode.uuid,
				url: currentEpisode.enclosures[0]?.url ?? "",
			});

			currentTranscriptRequested.current = true;
		}
	}, [podcast, currentEpisode, generateTranscript]);

	const transcriptRef = useRef<Vector<VectorDict>[]>([]);

	useEffect(() => {
		transcriptRef.current = currentTranscript ?? [];
	}, [currentTranscript]);

	const { data: queue } = api.queue.getQueue.useQuery();

	useEffect(() => {
		if (queue && queue.length > 0 && !currentEpisode) {
			const nextEpisode = queue[0];

			if (nextEpisode) {
				playEpisode(nextEpisode.episode, nextEpisode.podcast, true);
			}
		}
	}, [queue, currentEpisode]);

	useEffect(() => {
		if (
			currentEpisode?.uuid &&
			Math.abs(currentTime - lastUpdateTime.current) > 10 &&
			duration > 0
		) {
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

				const nonActiveWords = wordsRef.current?.querySelectorAll(
					".group[data-active='true']",
				);

				for (const word of nonActiveWords ?? []) {
					(word as HTMLElement).dataset.active = "false";
				}

				const activeWordIndex = transcriptRef.current.findIndex((word) => {
					return word.metadata?.start && word.metadata.start > currentTime;
				});

				const wordElement = wordsRef.current?.childNodes[activeWordIndex];
				if (wordElement) {
					(wordElement as HTMLElement).dataset.active = "true";
					if (!containerScrolledRef.current) {
						(wordElement as HTMLElement).scrollIntoView({
							behavior: "smooth",
							block: "center",
						});
					}
				}

				const prevElement = wordsRef.current?.childNodes[activeWordIndex - 1];
				if (prevElement) {
					(prevElement as HTMLElement).dataset.active = "true";
				}

				// const nextElement = wordsRef.current?.childNodes[activeWordIndex + 1];
				// if (nextElement) {
				// 	(nextElement as HTMLElement).dataset.active = "true";
				// }
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
					audioRef.current.playbackRate = playbackRate;
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
				}
			}
		},
		[
			isPlaying,
			currentEpisode?.id,
			getListeningHistoryByEpisodeUuid,
			updateListeningHistory,
			currentTime,
			duration,
			currentEpisode?.uuid,
			playbackRate,
		],
	);

	const togglePlayPause = useCallback(() => {
		if (!audioRef.current) {
			return;
		}

		if (isPlaying) {
			audioRef.current.pause();

			if (currentEpisode?.uuid) {
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

	const changePlaybackRate = useCallback((rate: number) => {
		if (audioRef.current) {
			audioRef.current.playbackRate = rate;
			setPlaybackRate(rate);
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
		wordsRef,
		containerScrolledRef,
		currentTranscript:
			currentTranscript && currentTranscript.length > 0
				? currentTranscript
				: data,
		currentTranscriptIsLoading: transcriptIsLoading || isPending,
		currentTranscriptRequested: currentTranscriptRequested.current,
		requestTranscript,
		playbackRate,
		changePlaybackRate,
	};

	return (
		<AudioPlayerContext.Provider value={value}>
			{children}
		</AudioPlayerContext.Provider>
	);
}
