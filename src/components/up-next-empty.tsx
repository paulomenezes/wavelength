import { AudioWaveformIcon, PodcastIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { InfiniteSlider } from "~/components/ui/infinite-slider";
import { cn } from "~/lib/utils";

const images = [
	"https://image.simplecastcdn.com/images/7f2f4c05-9c2f-4deb-82b7-b538062bc22d/73549bf1-94b3-40ff-8aeb-b4054848ec1b/3000x3000/the-daily-album-art-original.jpg?aid=rss_feed",
	"https://megaphone.imgix.net/podcasts/aa039a8e-de63-11ef-a44c-17dcb97c571d/image/b5fc2e4fa6e3aed351f8af92ad247ff4.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
	"https://megaphone.imgix.net/podcasts/8e5bcebc-ca16-11ee-89f0-0fa0b9bdfc7c/image/11f568857987283428d892402e623b21.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
	"https://megaphone.imgix.net/podcasts/ae6237e6-7e71-11e9-9c4d-3b02b0eab47c/image/21_VMPN_011_Waveform_Social_3000x3000.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
	"https://image.simplecastcdn.com/images/52528093-7778-44d3-b188-e2a3c58e2a2b/05b8e014-5152-4854-8fcb-c4a9d3da2114/3000x3000/nyt-ezraklein-albumartwork-3000px-2.jpg?aid=rss_feed",
	"https://lexfridman.com/wordpress/wp-content/uploads/powerpress/artwork_3000-230.png",
];

export function UpNextEmpty() {
	return (
		<section>
			<div className="py-24 md:py-32">
				<div className="mx-auto max-w-5xl px-6">
					<div className="group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 bg-muted/25 sm:max-w-md">
						<div>
							<InfiniteSlider gap={24} speed={20} speedOnHover={10}>
								{images.map((image) => (
									<ImageCard key={image}>
										<Image
											src={image}
											alt="Podcast cover"
											width={48}
											height={48}
											className="object-cover"
										/>
									</ImageCard>
								))}
							</InfiniteSlider>
						</div>

						<div>
							<InfiniteSlider gap={24} speed={20} speedOnHover={10} reverse>
								{images.reverse().map((image) => (
									<ImageCard key={image}>
										<Image
											src={image}
											alt="Podcast cover"
											width={48}
											height={48}
											className="object-cover"
										/>
									</ImageCard>
								))}
							</InfiniteSlider>
						</div>
						<div>
							<InfiniteSlider gap={24} speed={20} speedOnHover={10}>
								{images.map((image) => (
									<ImageCard key={image}>
										<Image
											src={image}
											alt="Podcast cover"
											width={48}
											height={48}
											className="object-cover"
										/>
									</ImageCard>
								))}
							</InfiniteSlider>
						</div>
						<div className="absolute inset-0 m-auto flex size-fit justify-center gap-2">
							<IntegrationCard
								className="size-16 bg-white/25 shadow-black-950/10 shadow-xl backdrop-blur-md backdrop-grayscale dark:border-white/10 dark:shadow-white/15"
								isCenter={true}
							>
								<AudioWaveformIcon className="size-6 text-primary" />
							</IntegrationCard>
						</div>
					</div>
					<div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
						<h2 className="text-balance font-semibold text-3xl md:text-4xl">
							Your Up Next queue is empty
						</h2>
						<p className="text-muted-foreground">
							Add episodes to your queue to listen to them later. You can add
							episodes from any podcast page.
						</p>

						<Button variant="outline" size="lg" asChild>
							<Link href="/discover">
								<PodcastIcon className="mr-2 size-4" />
								Discover Podcasts
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

function IntegrationCard({
	children,
	className,
	isCenter = false,
}: {
	children: React.ReactNode;
	className?: string;
	position?:
		| "left-top"
		| "left-middle"
		| "left-bottom"
		| "right-top"
		| "right-middle"
		| "right-bottom";
	isCenter?: boolean;
}) {
	return (
		<div
			className={cn(
				"relative z-20 flex size-12 rounded-full border bg-background",
				className,
			)}
		>
			<div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
				{children}
			</div>
		</div>
	);
}

function ImageCard({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative z-20 flex size-12 overflow-hidden rounded-md border bg-background",
				className,
			)}
		>
			<div className="h-full w-full">{children}</div>
		</div>
	);
}
