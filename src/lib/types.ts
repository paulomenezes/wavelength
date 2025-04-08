export interface PodcastData {
	id: number;
	title: string;
	trackCount: number;
	coverImage: string;
	author?: string;
	description?: string;
	hosts?: Host[];
	categories?: string[];
}

export interface Host {
	id: number;
	name: string;
	image: string;
	bio?: string;
}

export interface Episode {
	id: number;
	podcastId: number;
	title: string;
	duration: string;
	date: string;
	image?: string;
	summary?: string;
	description?: string;
	aiSummary?: string;
	transcription?: TranscriptSegment[];
	chapters?: Chapter[];
	hosts?: Host[];
}

export interface TranscriptSegment {
	id: number;
	speaker: string;
	text: string;
	startTime: string;
	endTime: string;
}

export interface Chapter {
	id: number;
	title: string;
	startTime: string;
	endTime: string;
	description?: string;
}

export interface QueueItem {
	id: string;
	type: "episode";
	episodeId: number;
	podcastId: number;
	addedAt: string;
	position: number;
}

export interface User {
	id: number;
	name: string;
	username: string;
	avatar: string;
	bio?: string;
	isFollowing: boolean;
	joinDate?: string;
	stats?: UserStats;
	settings?: UserSettings;
}

export interface UserStats {
	listenedEpisodes: number;
	listenedMinutes: number;
	subscribedPodcasts: number;
	followers: number;
	following: number;
}

export interface UserSettings {
	playbackSpeed: number;
	forwardSkip: number;
	backSkip: number;
	continuousPlayback: boolean;
	autoDownload: boolean;
	notifications: boolean;
	theme: "light" | "dark" | "system";
}

export interface ActivityItem {
	id: number;
	userId: number;
	type: "listen" | "like" | "subscribe" | "comment";
	podcastId?: number;
	episodeId?: number;
	timestamp: string;
	comment?: string;
}

export interface Category {
	id: string;
	name: string;
	description: string;
	image: string;
	color: string;
	podcastCount: number;
}
