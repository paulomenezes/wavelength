"use client";

import type React from "react";

import {
	Clock,
	GripVertical,
	ListMusic,
	Pause,
	Play,
	Plus,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
	getQueueWithDetails,
	removeFromQueue,
	reorderQueue,
} from "~/lib/queue-data";

export default function UpNextPage() {
	const [queue, setQueue] = useState(getQueueWithDetails());
	const [isPlaying, setIsPlaying] = useState<string | null>(null);
	const [draggedItem, setDraggedItem] = useState<string | null>(null);

	// Toggle play state for an item
	const togglePlay = (queueId: string) => {
		if (isPlaying === queueId) {
			setIsPlaying(null);
		} else {
			setIsPlaying(queueId);
		}
	};

	// Remove an item from the queue
	const handleRemove = (queueId: string) => {
		removeFromQueue(queueId);
		setQueue(getQueueWithDetails());
		if (isPlaying === queueId) {
			setIsPlaying(null);
		}
	};

	// Handle drag start
	const handleDragStart = (queueId: string) => {
		setDraggedItem(queueId);
	};

	// Handle drag over
	const handleDragOver = (e: React.DragEvent, queueId: string) => {
		e.preventDefault();
		if (!draggedItem || draggedItem === queueId) return;

		const draggedIndex = queue.findIndex((item) => item.id === draggedItem);
		const targetIndex = queue.findIndex((item) => item.id === queueId);

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

		// Update the backend data
		for (const item of queue) {
			reorderQueue(item.id, item.position);
		}

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
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-800"
						>
							<Play className="h-4 w-4" />
							Play All
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
						>
							<Plus className="h-4 w-4" />
							Add Episodes
						</button>
					</div>
				</div>

				{queue.length === 0 ? (
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
					<div className="space-y-4">
						{queue.map((item) => (
							<div
								key={item.id}
								draggable
								onDragStart={() => handleDragStart(item.id)}
								onDragOver={(e) => handleDragOver(e, item.id)}
								onDrop={handleDrop}
								onDragEnd={handleDragEnd}
								className={`flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md ${
									draggedItem === item.id ? "opacity-50" : ""
								}`}
							>
								<div className="cursor-move text-gray-400">
									<GripVertical className="h-5 w-5" />
								</div>

								<div className="relative shrink-0">
									<Image
										src={
											item.episode?.image ||
											item.podcast?.coverImage ||
											"/placeholder.svg"
										}
										alt={item.episode?.title || ""}
										width={80}
										height={80}
										className="rounded-md object-cover"
									/>
									<button
										type="button"
										onClick={() => togglePlay(item.id)}
										className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100"
									>
										{isPlaying === item.id ? (
											<Pause className="h-8 w-8 text-white" />
										) : (
											<Play className="h-8 w-8 text-white" />
										)}
									</button>
								</div>

								<div className="min-w-0 flex-1">
									<Link
										href={`/podcast/${item.podcastId}/episode/${item.episodeId}`}
										className="block hover:underline"
									>
										<h3 className="truncate font-medium">
											{item.episode?.title}
										</h3>
									</Link>
									<Link
										href={`/podcast/${item.podcastId}`}
										className="text-gray-500 text-sm hover:underline"
									>
										{item.podcast?.title}
									</Link>
									<div className="mt-1 flex items-center gap-4 text-gray-500 text-xs">
										<span className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{item.episode?.duration}
										</span>
										<span>
											Added {new Date(item.addedAt).toLocaleDateString()}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-2">
									{isPlaying === item.id && (
										<div className="font-medium text-gray-900 text-sm">
											Now Playing
										</div>
									)}
									<button
										type="button"
										onClick={() => handleRemove(item.id)}
										className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
										aria-label="Remove from queue"
									>
										<X className="h-5 w-5" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
