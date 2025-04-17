"use client";

import type { Vector } from "@upstash/vector";
import {
	Loader2,
	MessageSquareText,
	PodcastIcon,
	RssIcon,
	SparklesIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import type { VectorDict } from "~/types/vector-dict";
import { formatTime } from "~/utils/functions";
import { EmptyState } from "./empty-state";
import { Button } from "./ui/button";
import SearchInput from "./ui/search-input";

export function TranscriptView({
	transcript,
	podcastId,
	episodeId,
	url,
}: {
	transcript: Vector<VectorDict>[];
	podcastId: string;
	episodeId: string;
	url?: string | null;
}) {
	const [search, setSearch] = useState("");
	const router = useRouter();

	const {
		mutateAsync: generateTranscript,
		isPending,
		data,
	} = api.transcription.generateTranscriptAndUpsert.useMutation({
		onSuccess: () => {
			router.refresh();
		},
	});

	const filteredTranscript = (
		data && data.length > 0 ? data : transcript
	).filter((item) => item.data?.toLowerCase().includes(search.toLowerCase()));

	return (
		<div>
			<h2 className="mb-3 font-semibold text-xl">Transcript</h2>

			{filteredTranscript.length > 0 ? (
				<>
					<SearchInput
						placeholder="Search transcript"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onClear={() => setSearch("")}
						className="mb-4 w-full bg-white"
					/>

					<div className="space-y-2">
						{filteredTranscript.map((item) => (
							<div key={item.id} className="flex flex-col gap-0.5">
								{item.metadata?.start && (
									<span className="text-gray-500 text-xs">
										{formatTime(item.metadata.start)}
									</span>
								)}
								<Highlighter
									highlightClassName="bg-yellow-200"
									searchWords={[search]}
									autoEscape={true}
									textToHighlight={item.data ?? ""}
								/>
							</div>
						))}
					</div>
				</>
			) : (
				<EmptyState
					title="No transcript found for this episode"
					description="Please check back later or generate the transcript by clicking the button below"
					icons={[RssIcon, MessageSquareText, PodcastIcon]}
				>
					{url && (
						<Button
							variant="outline"
							className="mt-4"
							onClick={() =>
								toast.promise(
									generateTranscript({ podcastId, episodeId, url }),
									{
										loading: "Generating transcript...",
										success: "Transcript generated successfully",
										error: "Failed to generate transcript",
									},
								)
							}
							disabled={isPending}
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<SparklesIcon className="h-4 w-4" />
							)}
							{isPending ? "Generating..." : "Generate Transcript"}
						</Button>
					)}
				</EmptyState>
			)}
		</div>
	);
}
