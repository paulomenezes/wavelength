import { auth } from "@clerk/nextjs/server";
import DiscoverPage from "./discover/page";

import { CalendarIcon, ChevronRightIcon, Clock, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AddToQueueButton } from "~/components/add-to-queue-button";
import { PodcastChat, PodcastChatLoading } from "~/components/chat";
import {
	HomepageChatTrigger,
	PodcastChatTrigger,
} from "~/components/chat-trigger";
import { MarkAsListenedButton } from "~/components/mark-as-listened-button";
import { PlayButton } from "~/components/play-button";
import { buttonVariants } from "~/components/ui/button";
import {
	DisplayCard,
	DisplayCardContent,
	DisplayCardFooter,
	DisplayCardHeader,
} from "~/components/ui/display-card";
import { api } from "~/trpc/server";
import { formatTime, getDateDistance } from "~/utils/functions";

export default async function HomePage() {
	const user = await auth();

	if (user.userId) {
		return <HomePageContent />;
	}

	return <DiscoverPage />;
}

export async function HomePageContent() {
	return (
		<main className="mx-auto max-w-[96rem] space-y-12 bg-white px-4 py-6">
			<Suspense
				fallback={
					<PodcastChatLoading showPrompts>
						<PodcastChatTrigger />
					</PodcastChatLoading>
				}
			>
				<ChatContent />
			</Suspense>

			<div className="mb-8">
				<h1 className="mb-2 font-bold text-3xl">New releases</h1>
				<p className="max-w-2xl text-gray-600">
					Discover the latest episodes from your favorite podcasts.
				</p>
			</div>

			<Suspense>
				<SubscriptionsContent />
			</Suspense>
		</main>
	);
}

async function ChatContent() {
	const chatHistory = await api.chat.getChatHistory();

	return (
		<PodcastChat showPrompts chatHistory={chatHistory}>
			<HomepageChatTrigger />
		</PodcastChat>
	);
}

async function SubscriptionsContent() {
	const subscriptions = await api.subscription.getSubscriptions();

	return (
		<div className="grid grid-cols-1 gap-4">
			{subscriptions.map((sub) => {
				const episode = sub?.latestEpisode;

				if (!sub.podcast || !episode) {
					return null;
				}

				return (
					<DisplayCard key={sub.id} className="mb-4">
						<DisplayCardHeader>
							<div className="flex flex-row justify-between gap-1">
								<Link
									href={`/podcast/${sub.podcast.uuid}`}
									className={buttonVariants({ variant: "link", size: "sm" })}
								>
									{sub.podcast.imageUrl && (
										<Image
											src={sub.podcast.imageUrl}
											alt={sub.podcast.name ?? ""}
											width={24}
											height={24}
											className="size-6 rounded object-cover"
										/>
									)}

									{sub.podcast.name}
								</Link>
								{sub.group_key && (
									<Link
										href={`/podcast/${sub.podcast.uuid}?group=${sub.group_key}`}
										className={buttonVariants({
											variant: "link",
											size: "sm",
										})}
									>
										<TagIcon className="h-4 w-4" />
										{sub.group_key.startsWith("@")
											? sub.group_key.slice(sub.group_key.indexOf("-") + 1)
											: sub.group_key}
									</Link>
								)}
							</div>
						</DisplayCardHeader>
						<DisplayCardContent>
							<div className="flex flex-col gap-4 md:flex-row">
								{sub.podcast.imageUrl && (
									<div className="flex shrink-0 flex-row gap-4">
										<Link
											href={`/podcast/${sub.podcast.uuid}`}
											className="shrink-0"
										>
											<Image
												src={episode?.itunes_image ?? sub.podcast.imageUrl}
												alt={episode?.title ?? sub.podcast.name ?? ""}
												width={120}
												height={120}
												className="size-24 rounded object-cover lg:size-32"
											/>
										</Link>

										<div className="flex w-full flex-col justify-between gap-2 md:hidden md:flex-row md:items-center">
											<Link href={`/podcast/${sub.podcast.uuid}`}>
												<h3 className="line-clamp-2 font-medium text-lg">
													{episode?.title ?? sub.podcast.name}
												</h3>
											</Link>

											<PlayButton episode={episode} podcast={sub.podcast} />
										</div>
									</div>
								)}

								{episode && (
									<div className="flex-1">
										<div className="flex w-full flex-col items-start overflow-hidden">
											<div className="hidden w-full flex-col justify-between gap-2 md:flex md:flex-row md:items-center">
												<Link
													href={`/podcast/${sub.podcast.uuid}/episode/${episode.uuid}`}
												>
													<h3 className="line-clamp-1 font-medium text-lg">
														{episode.title}
													</h3>
												</Link>

												<PlayButton episode={episode} podcast={sub.podcast} />
											</div>
											<div className="mt-1 flex items-center gap-4 text-gray-500 text-sm">
												{episode.itunes_duration && (
													<span className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														{formatTime(episode.itunes_duration)}
													</span>
												)}
												{episode.published && (
													<span className="flex items-center gap-1">
														<CalendarIcon className="h-4 w-4" />
														{getDateDistance(episode.published)}
													</span>
												)}
											</div>
										</div>

										<div
											className="mt-3 line-clamp-1 text-gray-600 lg:line-clamp-2"
											dangerouslySetInnerHTML={{
												__html: episode.description ?? "",
											}}
										/>
									</div>
								)}
							</div>
						</DisplayCardContent>

						<DisplayCardFooter className="">
							<div className="flex w-full items-center justify-between gap-2 md:justify-end">
								{sub.group_key && (
									<Link
										href={`/podcast/${sub.podcast.uuid}?group=${sub.group_key}`}
										className={buttonVariants({
											variant: "link",
											size: "sm",
											className: "md:hidden",
										})}
									>
										<TagIcon className="h-4 w-4" />
										{sub.group_key.startsWith("@")
											? sub.group_key.slice(sub.group_key.indexOf("-") + 1)
											: sub.group_key}
									</Link>
								)}

								<div />

								{episode && (
									<Link
										href={`/podcast/${sub.podcast.uuid}/episode/${episode?.uuid}`}
										className={buttonVariants({ variant: "link" })}
									>
										<ChevronRightIcon className="h-5 w-5" />
										Episode details
									</Link>
								)}

								<div className="hidden items-center gap-2 md:flex">
									{episode && (
										<MarkAsListenedButton
											episode={episode}
											podcast={sub.podcast}
											variant="link"
											size="default"
										/>
									)}

									{episode && (
										<AddToQueueButton
											episode={episode}
											podcast={sub.podcast}
											variant="link"
											size="default"
										/>
									)}
								</div>
							</div>
						</DisplayCardFooter>
					</DisplayCard>
				);
			})}
		</div>
	);
}
