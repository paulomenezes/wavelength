import { getEpisode, podcastData } from "./data";
import type { ActivityItem, User, UserSettings } from "./types";

// Default user settings
export const defaultUserSettings: UserSettings = {
	playbackSpeed: 1.0,
	forwardSkip: 30,
	backSkip: 15,
	continuousPlayback: true,
	autoDownload: false,
	notifications: true,
	theme: "system",
};

// Mock user data
export const userData: User[] = [
	{
		id: 1,
		name: "Alex Johnson",
		username: "alexj",
		avatar: "https://picsum.photos/seed/user1/200/200",
		bio: "Podcast enthusiast and music lover. Always on the lookout for new audio experiences.",
		isFollowing: true,
		joinDate: "2021-03-15T10:30:00Z",
		stats: {
			listenedEpisodes: 342,
			listenedMinutes: 12480,
			subscribedPodcasts: 24,
			followers: 156,
			following: 89,
		},
		settings: { ...defaultUserSettings },
	},
	{
		id: 2,
		name: "Jamie Smith",
		username: "jamies",
		avatar: "https://picsum.photos/seed/user2/200/200",
		bio: "Tech journalist and avid podcast listener. Host of 'Tech Today' podcast.",
		isFollowing: true,
		joinDate: "2020-11-22T09:45:00Z",
		stats: {
			listenedEpisodes: 521,
			listenedMinutes: 18756,
			subscribedPodcasts: 32,
			followers: 278,
			following: 103,
		},
		settings: { ...defaultUserSettings, playbackSpeed: 1.5 },
	},
	{
		id: 3,
		name: "Taylor Wilson",
		username: "taylorw",
		avatar: "https://picsum.photos/seed/user3/200/200",
		bio: "Audio producer and sound designer. Creating immersive audio experiences.",
		isFollowing: true,
		joinDate: "2022-01-08T14:20:00Z",
		stats: {
			listenedEpisodes: 189,
			listenedMinutes: 7560,
			subscribedPodcasts: 17,
			followers: 92,
			following: 45,
		},
		settings: { ...defaultUserSettings, backSkip: 10, forwardSkip: 20 },
	},
	{
		id: 4,
		name: "Jordan Lee",
		username: "jordanl",
		avatar: "https://picsum.photos/seed/user4/200/200",
		bio: "Storyteller and narrative podcast creator. Always looking for the next great story.",
		isFollowing: false,
		joinDate: "2021-07-19T16:15:00Z",
		stats: {
			listenedEpisodes: 267,
			listenedMinutes: 9840,
			subscribedPodcasts: 19,
			followers: 124,
			following: 67,
		},
		settings: { ...defaultUserSettings, continuousPlayback: false },
	},
	{
		id: 5,
		name: "Casey Morgan",
		username: "caseym",
		avatar: "https://picsum.photos/seed/user5/200/200",
		bio: "True crime podcast addict and amateur detective. Solving mysteries one episode at a time.",
		isFollowing: false,
		joinDate: "2022-04-03T11:10:00Z",
		stats: {
			listenedEpisodes: 156,
			listenedMinutes: 5940,
			subscribedPodcasts: 12,
			followers: 78,
			following: 34,
		},
		settings: { ...defaultUserSettings, theme: "dark" },
	},
];

// Current user (for profile and settings)
export const currentUser = userData[0];

// Get user by ID
export function getUserById(userId: number): User | undefined {
	return userData.find((user) => user.id === userId);
}

// Get user by username
export function getUserByUsername(username: string): User | undefined {
	return userData.find((user) => user.username === username);
}

// Get activity feed for followed users
export function getActivityFeed(includeNonFollowing = false) {
	// Get IDs of users being followed
	const followedUserIds = userData
		.filter((user) => includeNonFollowing || user.isFollowing)
		.map((user) => user.id);

	// Filter activity to only include followed users
	return activityData
		.filter((activity) => followedUserIds.includes(activity.userId))
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
		)
		.map((activity) => {
			const user = getUserById(activity.userId);
			const podcast = activity.podcastId
				? podcastData.find((p) => p.id === activity.podcastId)
				: undefined;
			const episode =
				activity.podcastId && activity.episodeId
					? getEpisode(activity.podcastId, activity.episodeId)
					: undefined;

			return {
				...activity,
				user,
				podcast,
				episode,
				timeAgo: getTimeAgo(activity.timestamp),
			};
		});
}

// Get user activity
export function getUserActivity(userId: number) {
	return activityData
		.filter((activity) => activity.userId === userId)
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
		)
		.map((activity) => {
			const podcast = activity.podcastId
				? podcastData.find((p) => p.id === activity.podcastId)
				: undefined;
			const episode =
				activity.podcastId && activity.episodeId
					? getEpisode(activity.podcastId, activity.episodeId)
					: undefined;

			return {
				...activity,
				podcast,
				episode,
				timeAgo: getTimeAgo(activity.timestamp),
			};
		});
}

// Toggle follow status
export function toggleFollowUser(userId: number): boolean {
	const userIndex = userData.findIndex((user) => user.id === userId);
	if (userIndex !== -1) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		userData[userIndex]!.isFollowing = !userData[userIndex]!.isFollowing;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return userData[userIndex]!.isFollowing;
	}
	return false;
}

// Update user settings
export function updateUserSettings(
	userId: number,
	newSettings: Partial<UserSettings>,
): UserSettings {
	const userIndex = userData.findIndex((user) => user.id === userId);
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	if (userIndex !== -1 && userData[userIndex]!.settings) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		userData[userIndex]!.settings = {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			...userData[userIndex]!.settings,
			...newSettings,
		};
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return userData[userIndex]!.settings;
	}
	return defaultUserSettings;
}

// Get subscribed podcasts for a user
export function getUserSubscribedPodcasts(userId: number) {
	// For demo purposes, return a subset of podcasts
	return podcastData.slice(
		0,
		userData.find((u) => u.id === userId)?.stats?.subscribedPodcasts || 5,
	);
}

// Mock activity data
export const activityData: ActivityItem[] = [
	{
		id: 1,
		userId: 1,
		type: "listen",
		podcastId: 3,
		episodeId: 301,
		timestamp: "2023-04-15T10:30:00Z",
	},
	{
		id: 2,
		userId: 2,
		type: "subscribe",
		podcastId: 1,
		timestamp: "2023-04-15T09:45:00Z",
	},
	{
		id: 3,
		userId: 3,
		type: "like",
		podcastId: 4,
		episodeId: 402,
		timestamp: "2023-04-15T08:20:00Z",
	},
	{
		id: 4,
		userId: 1,
		type: "comment",
		podcastId: 2,
		episodeId: 201,
		timestamp: "2023-04-14T22:15:00Z",
		comment:
			"This episode blew my mind! The interview with the scientist about quantum computing was fascinating.",
	},
	{
		id: 5,
		userId: 2,
		type: "listen",
		podcastId: 5,
		episodeId: 501,
		timestamp: "2023-04-14T20:30:00Z",
	},
	{
		id: 6,
		userId: 3,
		type: "subscribe",
		podcastId: 6,
		timestamp: "2023-04-14T18:45:00Z",
	},
	{
		id: 7,
		userId: 1,
		type: "like",
		podcastId: 7,
		episodeId: 701,
		timestamp: "2023-04-14T16:20:00Z",
	},
	{
		id: 8,
		userId: 2,
		type: "comment",
		podcastId: 8,
		episodeId: 801,
		timestamp: "2023-04-14T14:15:00Z",
		comment:
			"The sound design in this episode is incredible. I felt like I was right there in the story.",
	},
	{
		id: 9,
		userId: 3,
		type: "listen",
		podcastId: 9,
		episodeId: 901,
		timestamp: "2023-04-14T12:30:00Z",
	},
	{
		id: 10,
		userId: 1,
		type: "subscribe",
		podcastId: 10,
		timestamp: "2023-04-14T10:45:00Z",
	},
	{
		id: 11,
		userId: 2,
		type: "like",
		podcastId: 11,
		episodeId: 1101,
		timestamp: "2023-04-14T08:20:00Z",
	},
	{
		id: 12,
		userId: 3,
		type: "comment",
		podcastId: 12,
		episodeId: 1201,
		timestamp: "2023-04-13T22:15:00Z",
		comment:
			"I can't believe how well they explained this complex topic. Made it so easy to understand!",
	},
];

// Helper function to format time ago
function getTimeAgo(timestamp: string): string {
	const now = new Date();
	const date = new Date(timestamp);
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	let interval = Math.floor(seconds / 31536000);
	if (interval >= 1) {
		return interval === 1 ? "1 year ago" : `${interval} years ago`;
	}

	interval = Math.floor(seconds / 2592000);
	if (interval >= 1) {
		return interval === 1 ? "1 month ago" : `${interval} months ago`;
	}

	interval = Math.floor(seconds / 86400);
	if (interval >= 1) {
		return interval === 1 ? "1 day ago" : `${interval} days ago`;
	}

	interval = Math.floor(seconds / 3600);
	if (interval >= 1) {
		return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
	}

	interval = Math.floor(seconds / 60);
	if (interval >= 1) {
		return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
	}

	return seconds < 10 ? "just now" : `${Math.floor(seconds)} seconds ago`;
}
