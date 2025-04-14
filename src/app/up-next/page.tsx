"use client";

import type React from "react";

import {
	CalendarIcon,
	Clock,
	GripVertical,
	ListMusic,
	ListXIcon,
	Loader2,
	Play,
	Plus,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlayButton } from "~/components/play-button";
import { Button } from "~/components/ui/button";
import {
	DisplayCard,
	DisplayCardContent,
	DisplayCardFooter,
} from "~/components/ui/display-card";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getDateDistance } from "~/utils/functions";

export default function UpNextPage() {
	const { data, refetch, isLoading } = api.queue.getQueue.useQuery();
	const { mutateAsync: clearQueue, isPending: clearQueueIsPending } =
		api.queue.clearQueue.useMutation({
			onSuccess: () => {
				refetch();
			},
		});
	const { mutateAsync: removeFromQueue } =
		api.queue.removeFromQueue.useMutation({
			onSuccess: () => {
				refetch();
			},
		});
	const { mutateAsync: reorderQueue, isPending } =
		api.queue.reorderQueue.useMutation({
			onSuccess: () => {
				refetch();
			},
		});

	const [queue, setQueue] = useState(data ?? []);

	useEffect(() => {
		setQueue(data ?? []);
	}, [data]);

	const [draggedItem, setDraggedItem] = useState<string | null>(null);

	// Remove an item from the queue
	const handleRemove = (queueId: string) => {
		toast.promise(removeFromQueue({ episodeUuid: queueId }), {
			loading: "Removing from queue...",
			success: "Removed from queue",
			error: "Failed to remove from queue",
		});
	};

	// Handle drag start
	const handleDragStart = (queueId: string) => {
		setDraggedItem(queueId);
	};

	// Handle drag over
	const handleDragOver = (e: React.DragEvent, queueId: string) => {
		e.preventDefault();
		if (!draggedItem || draggedItem === queueId) return;

		const draggedIndex = queue.findIndex(
			(item) => item.episode_uuid === draggedItem,
		);
		const targetIndex = queue.findIndex(
			(item) => item.episode_uuid === queueId,
		);

		if (draggedIndex !== -1 && targetIndex !== -1) {
			// Reorder in the UI
			const newQueue = [...queue];
			const [removed] = newQueue.splice(draggedIndex, 1);
			if (removed) {
				newQueue.splice(targetIndex, 0, removed);
			}

			// Update positions
			newQueue.forEach((item, index) => {
				item.position = index + 1;
			});

			setQueue(newQueue);
		}
	};

	// Handle drop
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();

		toast.promise(
			reorderQueue({
				items: queue.map((item) => ({ id: item.id, position: item.position })),
			}),
			{
				loading: "Reordering queue...",
				success: "Queue reordered",
				error: "Failed to reorder queue",
			},
		);

		setDraggedItem(null);
	};

	// Handle drag end
	const handleDragEnd = () => {
		setDraggedItem(null);
	};

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="font-bold text-3xl">Up Next</h1>
					<div className="flex items-center gap-4">
						{/* {queue[0]?.episode && queue[0]?.podcast && (
							<PlayButton
								episode={queue[0]?.episode}
								podcast={queue[0]?.podcast}
								variant="default"
								size="sm"
							/>
						)} */}
						{queue.length > 0 && (
							<Button
								type="button"
								variant="outline"
								disabled={clearQueueIsPending}
								onClick={() =>
									toast.promise(clearQueue(), {
										loading: "Clearing queue...",
										success: "Queue cleared",
										error: "Failed to clear queue",
									})
								}
							>
								{clearQueueIsPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<ListXIcon className="h-4 w-4" />
								)}
								Clear Queue
							</Button>
						)}
					</div>
				</div>

				{queue?.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<div className="mb-4 rounded-full bg-gray-100 p-4">
							<ListMusic className="h-8 w-8 text-gray-400" />
						</div>
						<h2 className="mb-2 font-semibold text-xl">
							Your Up Next queue is empty
						</h2>
						<p className="mb-6 max-w-md text-gray-500">
							Add episodes to your queue to listen to them later. You can add
							episodes from any podcast page.
						</p>
						<Link
							href="/"
							className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-800"
						>
							Discover Podcasts
						</Link>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{queue?.map((item) => (
							<DisplayCard
								key={item.id}
								draggable={!isPending && !isLoading}
								onDragStart={() => handleDragStart(item.episode_uuid)}
								onDragOver={(e) => handleDragOver(e, item.episode_uuid)}
								onDrop={handleDrop}
								onDragEnd={handleDragEnd}
								className={` ${
									draggedItem === item.episode_uuid ? "opacity-50" : ""
								}`}
							>
								<DisplayCardContent className="flex items-center gap-2 md:gap-4">
									<div
										className={cn(
											"text-gray-400",
											!isPending && !isLoading && "cursor-move",
										)}
									>
										<GripVertical className="h-5 w-5" />
									</div>

									<div className="relative shrink-0">
										<Image
											src={
												item.episode?.itunes_image ||
												item.podcast?.imageUrl ||
												"/placeholder.svg"
											}
											alt={item.episode?.title || ""}
											width={80}
											height={80}
											className="size-16 rounded-md object-cover md:size-20"
										/>
									</div>

									<div className="min-w-0 flex-1">
										<Link
											href={`/podcast/${item.podcast.uuid}/episode/${item.episode.uuid}`}
											className="block hover:underline"
										>
											<h3 className="truncate font-medium">
												{item.episode?.title}
											</h3>
										</Link>
										<Link
											href={`/podcast/${item.podcast.uuid}`}
											className="text-gray-500 text-sm hover:underline"
										>
											{item.podcast?.name}
										</Link>
										<div className="mt-1 flex flex-col text-gray-500 text-xs md:flex-row md:items-center md:gap-4">
											<span className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{item.episode?.itunes_duration}
											</span>

											<span className="flex items-center gap-1">
												<CalendarIcon className="h-3 w-3" />
												<span>Added {getDateDistance(item.added_at)}</span>
											</span>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<PlayButton
											episode={item.episode}
											podcast={item.podcast}
											variant="default"
										/>
									</div>
								</DisplayCardContent>

								<DisplayCardFooter className="justify-end">
									<div className="flex items-center justify-end gap-2">
										<Button
											type="button"
											onClick={() => handleRemove(item.episode_uuid)}
											variant="link"
											aria-label="Remove from queue"
										>
											<X className="h-5 w-5" />
											Remove from queue
										</Button>
									</div>
								</DisplayCardFooter>
							</DisplayCard>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
