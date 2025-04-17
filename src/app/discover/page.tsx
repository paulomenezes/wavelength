import { TrendingUpIcon } from "lucide-react";
import { Suspense } from "react";
import { CategoryHeader } from "~/components/category-header";
import { PodcastChat, PodcastChatLoading } from "~/components/chat";
import {
	HomepageChatTrigger,
	PodcastChatTrigger,
} from "~/components/chat-trigger";
import { PodcastCard, PodcastCardLoading } from "~/components/podcast-card";
import type { Genre } from "~/graphql/generated";
import { api } from "~/trpc/server";
import { genreConfig } from "~/utils/categories";
import { HOMEPAGE_GENRES } from "~/utils/consts";

export default async function DiscoverPage() {
	return (
		<>
			<CategoryHeader />

			<Suspense
				fallback={
					<PodcastChatLoading showPrompts>
						<PodcastChatTrigger />
					</PodcastChatLoading>
				}
			>
				<ChatHistory />
			</Suspense>

			<main className="mx-auto max-w-[96rem] space-y-12 bg-white px-4 py-6">
				<section id="trending" className="scroll-mt-32 pt-4">
					<h2 className="mb-4 flex items-center gap-2 font-bold text-2xl">
						<TrendingUpIcon className="size-5" />
						Trending
					</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
						<Suspense
							fallback={Array.from({ length: 12 }).map((_, index) => (
								<PodcastCardLoading key={index.toString()} />
							))}
						>
							<TrendingContent />
						</Suspense>
					</div>
				</section>

				{HOMEPAGE_GENRES.map((genre) => {
					const Icon = genreConfig[genre]?.icon;

					return (
						<section key={genre} id={genre} className="scroll-mt-32 pt-4">
							<h2 className="mb-4 flex items-center gap-2 font-bold text-2xl">
								{Icon && <Icon className="size-5" />}
								{genreConfig[genre]?.label}
							</h2>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
								<Suspense
									fallback={Array.from({ length: 12 }).map((_, index) => (
										<PodcastCardLoading key={index.toString()} />
									))}
								>
									<GenreContent genre={genre} />
								</Suspense>
							</div>
						</section>
					);
				})}
			</main>
		</>
	);
}

export async function ChatHistory() {
	const chatHistory = await api.chat.getChatHistory();

	return (
		<PodcastChat showPrompts chatHistory={chatHistory}>
			<HomepageChatTrigger />
		</PodcastChat>
	);
}

export async function TrendingContent() {
	const podcasts = await api.podcast.getTrending();

	return (
		<>
			{podcasts.slice(0, 12).map((podcast) => (
				<PodcastCard key={podcast.uuid} podcast={podcast} />
			))}
		</>
	);
}

export async function GenreContent({ genre }: { genre: Genre }) {
	const podcasts = await api.podcast.getPodcastsByGenre({ genre });

	return (
		<>
			{podcasts.slice(0, 12).map((podcast) => (
				<PodcastCard key={podcast.uuid} podcast={podcast} />
			))}
		</>
	);
}
