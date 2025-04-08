import type {
	Chapter,
	Episode,
	Host,
	PodcastData,
	TranscriptSegment,
} from "./types";

// Host data
export const hostData: Host[] = [
	{
		id: 1,
		name: "Mel Robbins",
		image:
			"https://image.simplecastcdn.com/images/00c81e60-45f9-4643-9fed-2184b2b6a3d3/250de02d-a1a7-4796-8009-fe0df67d5d20/3000x3000/sxm-cover-melrobbins-3000x3000-final-white.jpg?aid=rss_feed",
		bio: "Mel Robbins is the host of the #1 podcast on Audible, the co-founder of 143 Studios, a digital media company that produces content in partnership with Fortune 500 brands, and an international bestselling author.",
	},
	{
		id: 2,
		name: "Amy Poehler",
		image:
			"https://megaphone.imgix.net/podcasts/aa039a8e-de63-11ef-a44c-17dcb97c571d/image/b5fc2e4fa6e3aed351f8af92ad247ff4.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
		bio: "Amy Poehler is an actress, comedian, writer, producer, and director. She is best known for her work on Saturday Night Live and Parks and Recreation.",
	},
	{
		id: 3,
		name: "Michael Barbaro",
		image:
			"https://image.simplecastcdn.com/images/7f2f4c05-9c2f-4deb-82b7-b538062bc22d/73549bf1-94b3-40ff-8aeb-b4054848ec1b/3000x3000/the-daily-album-art-original.jpg?aid=rss_feed",
		bio: "Michael Barbaro is the host of The Daily, a podcast by The New York Times. He joined The Times in 2005 from The Washington Post.",
	},
	{
		id: 4,
		name: "Joe Rogan",
		image:
			"https://megaphone.imgix.net/podcasts/8e5bcebc-ca16-11ee-89f0-0fa0b9bdfc7c/image/11f568857987283428d892402e623b21.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
		bio: "Joe Rogan is a stand-up comedian, UFC commentator, and host of The Joe Rogan Experience podcast.",
	},
];

// Generate transcript segments
const generateTranscript = (
	episodeId: number,
	count = 10,
): TranscriptSegment[] => {
	const speakers = ["Host", "Guest", "Co-host"];

	return Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		speaker: speakers[Math.floor(Math.random() * speakers.length)]!,
		text: `This is a sample transcript segment ${i + 1}. It demonstrates how the conversation flows in this episode. The speakers take turns discussing various topics related to the episode theme.`,
		startTime: `${Math.floor((i * 2) / 60)}:${((i * 2) % 60).toString().padStart(2, "0")}`,
		endTime: `${Math.floor(((i + 1) * 2) / 60)}:${(((i + 1) * 2) % 60).toString().padStart(2, "0")}`,
	}));
};

// Generate chapters
const generateChapters = (episodeId: number, count = 5): Chapter[] => {
	return Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		title: `Chapter ${i + 1}: ${["Introduction", "Main Discussion", "Guest Interview", "Q&A Session", "Conclusion"][i % 5]}`,
		startTime: `${Math.floor((i * 10) / 60)}:${((i * 10) % 60).toString().padStart(2, "0")}`,
		endTime: `${Math.floor(((i + 1) * 10) / 60)}:${(((i + 1) * 10) % 60).toString().padStart(2, "0")}`,
		description: `This chapter covers ${["the basics", "in-depth analysis", "expert opinions", "audience questions", "key takeaways"][i % 5]} related to the episode topic.`,
	}));
};

// Episode data generator function
const generateEpisodes = (podcastId: number, count = 5): Episode[] => {
	return Array.from({ length: count }, (_, i) => {
		const episodeId = podcastId * 100 + i + 1;
		const podcast = podcastData.find((p) => p.id === podcastId);

		return {
			id: episodeId,
			podcastId: podcastId,
			title: `Episode ${i + 1}: ${podcast?.title || "Podcast"} - Part ${i + 1}`,
			duration: `${Math.floor(Math.random() * 60) + 20}:${Math.floor(
				Math.random() * 60,
			)
				.toString()
				.padStart(2, "0")}`,
			date: `${Math.floor(Math.random() * 28) + 1} Apr 2023`,
			image: `https://picsum.photos/seed/${podcastId}-${i}/600/600`,
			summary: `In this episode, we dive deep into fascinating topics related to ${podcast?.title || "our podcast"}. Join us as we explore new ideas, interview special guests, and share insights that will change how you think about the world.`,
			description: `Episode ${i + 1} of ${podcast?.title || "our podcast"} features an in-depth discussion on the latest trends and developments in the field. Our hosts are joined by special guests who share their expertise and unique perspectives on the subject matter. Whether you're a long-time listener or new to the show, this episode offers valuable insights and engaging conversations that will keep you entertained and informed.`,
			aiSummary:
				"AI-Generated Summary: This episode primarily focuses on three key areas. First, the hosts discuss recent developments in the industry, highlighting the impact of technological advancements. Second, they interview an expert who provides valuable insights on best practices and future trends. Finally, they address common misconceptions and answer questions from listeners. The conversation is both informative and engaging, making complex topics accessible to a general audience.",
			transcription: generateTranscript(episodeId),
			chapters: generateChapters(episodeId),
			hosts: podcast?.hosts || [],
		};
	});
};

export const podcastData: PodcastData[] = [
	{
		id: 1,
		title: "The Mel Robbins Podcast",
		trackCount: 278,
		coverImage:
			"https://image.simplecastcdn.com/images/00c81e60-45f9-4643-9fed-2184b2b6a3d3/250de02d-a1a7-4796-8009-fe0df67d5d20/3000x3000/sxm-cover-melrobbins-3000x3000-final-white.jpg?aid=rss_feed",
		author: "Mel Robbins",
		description:
			"You can change your life and Mel Robbins will show you how. The Mel Robbins Podcast is the #1 podcast on the globe for a reason: Mel's simple, research-backed advice has changed millions of people's lives, and in every episode, she's giving you all her hard-fought secrets, science-backed tools, and deeply personal stories, so you can change yours too.",
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		hosts: [hostData[0]!],
	},
	{
		id: 2,
		title: "Good Hang with Amy Poehler",
		trackCount: 5,
		coverImage:
			"https://megaphone.imgix.net/podcasts/aa039a8e-de63-11ef-a44c-17dcb97c571d/image/b5fc2e4fa6e3aed351f8af92ad247ff4.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
		author: "The Ringer",
		description:
			"Come hang with Amy Poehler. Each week on her podcast, she'll welcome celebrities and fun people to her studio. They'll share stories about their careers, mutual friends, shared enthusiasms, and most importantly, what's been making them laugh.",
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		hosts: [hostData[1]!],
	},
	{
		id: 3,
		title: "The Daily",
		trackCount: 2455,
		coverImage:
			"https://image.simplecastcdn.com/images/7f2f4c05-9c2f-4deb-82b7-b538062bc22d/73549bf1-94b3-40ff-8aeb-b4054848ec1b/3000x3000/the-daily-album-art-original.jpg?aid=rss_feed",
		author: "The New York Times",
		description:
			"This is what the news should sound like. The biggest stories of our time, told by the best journalists in the world. Hosted by Michael Barbaro. Twenty minutes a day, five days a week, ready by 6 a.m.",
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		hosts: [hostData[2]!],
	},
	{
		id: 4,
		title: "The Joe Rogan Experience",
		trackCount: 2475,
		coverImage:
			"https://megaphone.imgix.net/podcasts/8e5bcebc-ca16-11ee-89f0-0fa0b9bdfc7c/image/11f568857987283428d892402e623b21.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
		author: "Joe Rogan",
		description: "The official podcast of comedian Joe Rogan.",
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		hosts: [hostData[3]!],
	},
	{
		id: 5,
		title: "Dateline NBC",
		trackCount: 603,
		coverImage:
			"https://image.simplecastcdn.com/images/ae183fe2-c634-458a-93dd-5770f0676f77/b010809a-c311-425c-9325-2235c21e6939/3000x3000/7f0421f73d2ce0ca272e392c937e1a301285d44fe7c6d710c2844d80c0c7bb1a3e9838ac03ee80fc64199891cb9d5c6e9d4490f5081fb379c0ab2317f2cadf14.jpeg?aid=rss_feed",
		author: "NBC News",
		description:
			"Current and classic episodes, featuring compelling true-crime mysteries, powerful documentaries and in-depth investigations.",
		hosts: [
			{
				id: 5,
				name: "Keith Morrison",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Keith Morrison is a Canadian broadcast journalist and correspondent for Dateline NBC.",
			},
			{
				id: 6,
				name: "Josh Mankiewicz",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Josh Mankiewicz is an American journalist and correspondent for Dateline NBC.",
			},
		],
	},
	{
		id: 6,
		title: "Crime Junkie",
		trackCount: 452,
		coverImage:
			"https://image.simplecastcdn.com/images/a1a87b67-2865-4234-a087-b342aa30c358/ae42d51b-df99-4b19-bb3f-09f25598bcdd/3000x3000/crimejunkie-logo-registered.jpg?aid=rss_feed",
		author: "audiochuck",
		description:
			"If you can never get enough true crime... Congratulations, you've found your people.",
		hosts: [
			{
				id: 7,
				name: "Ashley Flowers",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Ashley Flowers is the founder and CEO of audiochuck, a female-focused podcast network.",
			},
			{
				id: 8,
				name: "Brit Prawat",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Brit Prawat is the co-host of Crime Junkie and a true crime enthusiast.",
			},
		],
	},
	{
		id: 7,
		title: "The MeidasTouch Podcast",
		trackCount: 1866,
		coverImage:
			"https://megaphone.imgix.net/podcasts/dd29504c-fac9-11eb-916e-c35704fa9b0d/image/MT-Pod-New-Hole-3000.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
		author: "MeidasTouch Network",
		description:
			"The MeidasTouch Podcast combines brotherly love, comedy, news coverage, and deep discussions about supporting our democracy.",
		hosts: [
			{
				id: 9,
				name: "Ben Meiselas",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Ben Meiselas is a civil rights attorney and co-founder of MeidasTouch.",
			},
			{
				id: 10,
				name: "Brett Meiselas",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Brett Meiselas is an Emmy Award-winning video editor and co-founder of MeidasTouch.",
			},
		],
	},
	{
		id: 8,
		title: "THREE",
		trackCount: 17,
		coverImage:
			"https://image.simplecastcdn.com/images/7d68c467-d3d7-41c3-b7c0-92218b530432/fa51e8ac-ccf1-4e63-b566-0c014b757487/3000x3000/three-season-2-show-cover-3000px-300ppi.jpg?aid=rss_feed",
		author: "audiochuck",
		description:
			"For over 30 years, the murder of 23-year-old Dana Ireland haunted the island of Hawai'i, leaving behind a tangled web of suspicion, betrayal, and unanswered questions.",
		hosts: [
			{
				id: 11,
				name: "Leila Day",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Leila Day is an award-winning journalist and podcast producer.",
			},
		],
	},
	{
		id: 9,
		title: "The Ezra Klein Show",
		trackCount: 405,
		coverImage:
			"https://image.simplecastcdn.com/images/52528093-7778-44d3-b188-e2a3c58e2a2b/05b8e014-5152-4854-8fcb-c4a9d3da2114/3000x3000/nyt-ezraklein-albumartwork-3000px-2.jpg?aid=rss_feed",
		author: "New York Times Opinion",
		description:
			"Ezra Klein invites you into a conversation on something that matters.",
		hosts: [
			{
				id: 12,
				name: "Ezra Klein",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Ezra Klein is a journalist, political analyst, and co-founder of Vox.",
			},
		],
	},
	{
		id: 10,
		title: "Call Her Daddy",
		trackCount: 457,
		coverImage:
			"https://image.simplecastcdn.com/images/5b7d8c77-15ba-4eff-a999-2e725db21db5/06e5816c-eedf-4569-93c6-e65ff6bc3d91/3000x3000/sxm-cover-call-her-daddy-3000x3000-final-1-left-black.jpg?aid=rss_feed",
		author: "Alex Cooper",
		description:
			"The most-listened to podcast by women. Alex Cooper's Call Her Daddy has been creating conversation since 2018.",
		hosts: [
			{
				id: 13,
				name: "Alex Cooper",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Alex Cooper is a podcaster, comedian, and host of Call Her Daddy.",
			},
		],
	},
	{
		id: 11,
		title: "Up First from NPR",
		trackCount: 500,
		coverImage:
			"https://media.npr.org/assets/img/2022/09/23/up-first_tile_npr-network-01_sq-cd1dc7e35846274fc57247cfcb9cd4dddbb2d635.jpg?s=1400&c=66&f=jpg",
		author: "NPR",
		description:
			"NPR's Up First is the news you need to start your day. The three biggest stories of the day, with reporting and analysis from NPR News — in 10 minutes.",
		hosts: [
			{
				id: 14,
				name: "Rachel Martin",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Rachel Martin is a host of Morning Edition and Up First.",
			},
			{
				id: 15,
				name: "Steve Inskeep",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Steve Inskeep is a host of Morning Edition and Up First.",
			},
		],
	},
	{
		id: 12,
		title: "The Telepathy Tapes",
		trackCount: 19,
		coverImage:
			"https://megaphone.imgix.net/podcasts/f3f92d20-d35f-11ef-b101-7ba1d4d11f3a/image/9814fdfddb38d2ce4b2f3f2649e2f1bf.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
		author: "Ky Dickens",
		description:
			"In a world that often dismisses the extraordinary as mere fantasy, The Telepathy Tapes dares to explore the profound abilities of non-speakers with autism.",
		hosts: [
			{
				id: 16,
				name: "Ky Dickens",
				image: "/placeholder.svg?height=100&width=100",
				bio: "Ky Dickens is a documentary filmmaker and the host of The Telepathy Tapes.",
			},
		],
	},
];

// Generate episodes for each podcast
export const getEpisodes = (podcastId: number): Episode[] => {
	return generateEpisodes(podcastId);
};

// Get a specific episode
export const getEpisode = (
	podcastId: number,
	episodeId: number,
): Episode | undefined => {
	const episodes = generateEpisodes(podcastId);
	return episodes.find((episode) => episode.id === episodeId);
};
