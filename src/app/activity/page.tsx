"use client";

import {
	Filter,
	Heart,
	MessageSquare,
	Play,
	UserCheck,
	UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getActivityFeed } from "~/lib/user-data";

export default function ActivityPage() {
	const [showAll, setShowAll] = useState(false);
	const [activityFeed, setActivityFeed] = useState(getActivityFeed());
	const [showFilters, setShowFilters] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState<string[]>([
		"listen",
		"like",
		"subscribe",
		"comment",
	]);

	const toggleFilter = (filter: string) => {
		if (selectedFilters.includes(filter)) {
			setSelectedFilters(selectedFilters.filter((f) => f !== filter));
		} else {
			setSelectedFilters([...selectedFilters, filter]);
		}
	};

	const toggleShowAll = () => {
		const newShowAll = !showAll;
		setShowAll(newShowAll);
		setActivityFeed(getActivityFeed(newShowAll));
	};

	const handleFollowToggle = (userId: number) => {
		setActivityFeed(getActivityFeed(showAll));
	};

	// Filter the activity feed based on selected filters
	const filteredActivity = activityFeed.filter((item) =>
		selectedFilters.includes(item.type),
	);

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="font-bold text-3xl">Activity</h1>
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => setShowFilters(!showFilters)}
							className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
						>
							<Filter className="h-4 w-4" />
							Filter
						</button>
						<button
							type="button"
							onClick={toggleShowAll}
							className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-800"
						>
							{showAll ? "Show Following Only" : "Show All Users"}
						</button>
					</div>
				</div>

				{/* Filters */}
				{showFilters && (
					<div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
						<h2 className="mb-3 font-medium text-gray-700 text-sm">
							Filter by activity type:
						</h2>
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => toggleFilter("listen")}
								className={`rounded-full px-3 py-1 text-sm ${
									selectedFilters.includes("listen")
										? "bg-gray-900 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								Listening
							</button>
							<button
								type="button"
								onClick={() => toggleFilter("like")}
								className={`rounded-full px-3 py-1 text-sm ${
									selectedFilters.includes("like")
										? "bg-gray-900 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								Likes
							</button>
							<button
								type="button"
								onClick={() => toggleFilter("subscribe")}
								className={`rounded-full px-3 py-1 text-sm ${
									selectedFilters.includes("subscribe")
										? "bg-gray-900 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								Subscriptions
							</button>
							<button
								type="button"
								onClick={() => toggleFilter("comment")}
								className={`rounded-full px-3 py-1 text-sm ${
									selectedFilters.includes("comment")
										? "bg-gray-900 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								Comments
							</button>
						</div>
					</div>
				)}

				{/* Activity Feed */}
				<div className="space-y-6">
					{filteredActivity.length === 0 ? (
						<div className="py-12 text-center">
							<p className="text-gray-500">
								No activity to show. Try following more users or adjusting your
								filters.
							</p>
						</div>
					) : (
						filteredActivity.map((activity) => (
							<div
								key={activity.id}
								className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-sm"
							>
								<div className="flex items-start gap-4">
									{/* User Avatar */}
									<Link
										href={`/profile/${activity.user?.username}`}
										className="shrink-0"
									>
										<Image
											src={
												activity.user?.avatar ||
												"/placeholder.svg?height=48&width=48"
											}
											alt={activity.user?.name || "User"}
											width={48}
											height={48}
											className="rounded-full object-cover"
										/>
									</Link>

									{/* Activity Content */}
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Link
													href={`/profile/${activity.user?.username}`}
													className="font-medium hover:underline"
												>
													{activity.user?.name}
												</Link>
												<span className="text-gray-500">
													@{activity.user?.username}
												</span>
											</div>
											<span className="text-gray-500 text-sm">
												{activity.timeAgo}
											</span>
										</div>

										{/* Activity Type */}
										<p className="mb-3 text-gray-700">
											{activity.type === "listen" &&
												"Listened to an episode of"}
											{activity.type === "like" && "Liked an episode of"}
											{activity.type === "subscribe" && "Subscribed to"}
											{activity.type === "comment" &&
												"Commented on an episode of"}
											<Link
												href={`/podcast/${activity.podcastId}`}
												className="font-medium hover:underline"
											>
												{activity.podcast?.title}
											</Link>
										</p>

										{/* Episode Info (if applicable) */}
										{activity.episode && (
											<div className="mb-3 flex items-center gap-3 rounded-md bg-gray-50 p-3">
												<Image
													src={
														activity.episode.image ||
														activity.podcast?.coverImage ||
														"/placeholder.svg?height=60&width=60"
													}
													alt={activity.episode.title}
													width={60}
													height={60}
													className="rounded-md object-cover"
												/>
												<div className="min-w-0">
													<Link
														href={`/podcast/${activity.podcastId}/episode/${activity.episodeId}`}
														className="line-clamp-1 font-medium hover:underline"
													>
														{activity.episode.title}
													</Link>
													{/* <div className="flex items-center gap-2 text-gray-500 text-sm">
														<span>{activity.episode.duration}</span>
													</div> */}
												</div>
												<button
													type="button"
													className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
												>
													<Play className="h-4 w-4" />
												</button>
											</div>
										)}

										{/* Comment (if applicable) */}
										{activity.type === "comment" && activity.comment && (
											<div className="mb-3 rounded-md bg-gray-50 p-3">
												<p className="text-gray-700 text-sm">
													{activity.comment}
												</p>
											</div>
										)}

										{/* Action Buttons */}
										<div className="flex items-center gap-4 text-gray-500">
											<button
												type="button"
												className="flex items-center gap-1 hover:text-gray-700"
											>
												<Heart className="h-4 w-4" />
												<span className="text-xs">Like</span>
											</button>
											<button
												type="button"
												className="flex items-center gap-1 hover:text-gray-700"
											>
												<MessageSquare className="h-4 w-4" />
												<span className="text-xs">Reply</span>
											</button>
										</div>
									</div>

									{/* Follow Button */}
									{activity.user && (
										<button
											type="button"
											onClick={() =>
												activity.user && handleFollowToggle(activity.user.id)
											}
											className={`inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-1 font-medium text-xs ${
												activity.user.isFollowing
													? "bg-gray-200 text-gray-700 hover:bg-gray-300"
													: "bg-gray-900 text-white hover:bg-gray-800"
											}`}
										>
											{activity.user.isFollowing ? (
												<>
													<UserCheck className="h-3 w-3" />
													Following
												</>
											) : (
												<>
													<UserPlus className="h-3 w-3" />
													Follow
												</>
											)}
										</button>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
