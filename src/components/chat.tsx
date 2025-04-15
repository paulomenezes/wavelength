"use client";

import type React from "react";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { Search } from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
	ChatPodcastMessage,
	ChatTextMessage,
} from "~/components/chat-messages";
import { PlaceholdersAndVanishInput } from "~/components/placeholder-input";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function PodcastChat({
	children,
	showPrompts = false,
}: {
	children: React.ReactNode;
	showPrompts?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	const segments = useSelectedLayoutSegments();

	const { data: podcast } = api.podcast.getPodcastById.useQuery(
		{
			uuid: segments[1] ?? "",
		},
		{
			enabled: segments.length >= 2 && segments[0] === "podcast",
		},
	);

	const { data: episode } = api.podcast.getEpisodeById.useQuery(
		{
			uuid: segments[3] ?? "",
		},
		{
			enabled:
				segments.length >= 3 &&
				segments[0] === "podcast" &&
				segments[2] === "episode",
		},
	);

	const { data: transcript } = api.transcription.getTranscript.useQuery(
		{
			podcastId: segments[1] ?? "",
			episodeId: segments[3] ?? "",
		},
		{
			enabled:
				segments.length >= 3 &&
				segments[0] === "podcast" &&
				segments[2] === "episode",
		},
	);

	// Suggested questions
	const suggestions = [
		"What are the top podcasts about technology?",
		"Recommend a podcast about true crime",
		"Find podcasts with short episodes",
	];

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
		setMessages,
	} = useChat({
		api: "/api/chat",
		onFinish: () => {
			// Scroll to bottom when new message arrives
			setTimeout(() => {
				if (chatContainerRef.current) {
					chatContainerRef.current.scrollTop =
						chatContainerRef.current.scrollHeight;
				}
			}, 100);
		},
	});

	useEffect(() => {
		const newMessages = [
			...(podcast
				? ([
						{
							id: "podcast-info-id",
							role: "system",
							content: `You are a helpful assistant that can help with podcast recommendations and search for podcasts.
The user is currently on the page of the podcast: ${podcast?.name}, so maybe you can help them find episodes of this podcast or answer questions about it.

Here is some information about the podcast: ${podcast?.name} and description: ${podcast?.description}.
Here is the title of the latest 10 episodes: ${podcast?.episodes?.map((episode) => episode?.name).join(", ")}`,
						},
					] as const)
				: []),
			...(episode
				? ([
						{
							id: "episode-info-id",
							role: "system",
							content: `Here is some information about the episode: ${episode?.title} and description: ${episode?.description}.
Here is the transcript of the episode: ${transcript?.map((t) => t.data).join("\n")}`,
						},
					] as const)
				: []),
		];

		setMessages((prev) => [...prev, ...newMessages]);
	}, [podcast, episode, transcript, setMessages]);

	// Scroll to bottom when chat opens
	useEffect(() => {
		if (isOpen && chatContainerRef.current && messages.length > 0) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [isOpen, messages.length]);

	// Close suggestions when chat opens or when there are messages
	useEffect(() => {
		if (isOpen || messages.length > 0) {
			setShowSuggestions(false);
		}
	}, [isOpen, messages.length]);

	// Add keyboard shortcut listener
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault(); // Prevent default browser behavior
				if (inputRef.current) {
					inputRef.current.focus();
				}
				if (messages.length === 0) {
					setShowSuggestions(true);
				} else {
					toggleChat();
				}
			}

			// Close chat when pressing Escape key
			if (e.key === "Escape") {
				e.preventDefault();
				if (isOpen) {
					setIsOpen(false);
				} else if (showSuggestions) {
					setShowSuggestions(false);
				}
				if (inputRef.current) {
					inputRef.current.blur();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, showSuggestions, messages.length]);

	// Handle input changes - open chat if user starts typing
	const handleInputChangeWithSideEffects = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		handleInputChange(e);
		inputRef.current?.focus();

		// If user starts typing and there are no messages, open the chat
		if (e.target.value && messages.length === 0 && !isOpen) {
			setShowSuggestions(false);
			setIsOpen(true);
		}
	};

	const toggleChat = () => {
		setIsOpen(!isOpen);
		setShowSuggestions(false);
	};

	const handleSuggestionClick = (suggestion: string) => {
		setIsOpen(true);
		setShowSuggestions(false);

		append({
			role: "user",
			content: suggestion,
		});

		inputRef.current?.focus();

		// Submit the form with the suggestion
		setTimeout(() => {
			const fakeEvent = {
				preventDefault: () => {},
			} as React.FormEvent<HTMLFormElement>;
			handleSubmit(fakeEvent);
		}, 100);
	};

	const handleInputFocus = () => {
		if (!isOpen && !showSuggestions && messages.length === 0) {
			setShowSuggestions(true);
		} else if (!isOpen && !showSuggestions) {
			toggleChat();
		}
	};

	const renderMessageContent = useCallback((message: UIMessage) => {
		if (message.role === "system") {
			return null;
		}

		if (message.parts && message.parts.length > 0) {
			return message.parts.map((part) => {
				if (part.type === "text") {
					return (
						<ChatTextMessage
							key={part.text}
							messageRole={message.role}
							content={part.text}
						/>
					);
				}

				if (
					part.type === "tool-invocation" &&
					part.toolInvocation.state === "result"
				) {
					if (part.toolInvocation.toolName === "searchPodcasts") {
						return (
							<Fragment key={part.toolInvocation.toolCallId}>
								{part.toolInvocation.result.length > 0 ? (
									<ChatTextMessage
										messageRole="assistant"
										content="Here are some podcasts I found for you:"
									/>
								) : (
									<ChatTextMessage
										messageRole="assistant"
										content="I couldn't find any podcasts for you."
									/>
								)}
								{part.toolInvocation.result.map(
									(result: {
										uuid: string;
										title: string;
										imageUrl: string;
										author: string;
									}) => (
										<ChatPodcastMessage
											key={result.uuid}
											uuid={result.uuid}
											title={result.title ?? ""}
											imageUrl={result.imageUrl}
											author={result.author}
										/>
									),
								)}
							</Fragment>
						);
					}

					if (part.toolInvocation.toolName === "analyzePodcastQuery") {
						return (
							<ChatTextMessage
								key={part.toolInvocation.toolCallId}
								messageRole="assistant"
								content={part.toolInvocation.result}
							/>
						);
					}
				}
			});
		}

		return (
			<ChatTextMessage messageRole={message.role} content={message.content} />
		);
	}, []);

	return (
		<div>
			<div className={cn("flex items-center")}>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					{children}
					<DialogContent className="flex flex-col justify-between">
						<DialogHeader className="hidden">
							<DialogTitle>Podcast Chat</DialogTitle>
						</DialogHeader>

						<div className="mt-8 flex-1 space-y-3 overflow-y-auto p-4">
							{messages.length === 0 ? (
								<div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
									<Search className="mb-3 h-10 w-10 opacity-50" />
									<p className="font-medium text-base">
										Search for podcasts or ask questions
									</p>
									<p className="text-xs">
										Try "Find podcasts about AI" or "What are trending
										podcasts?"
									</p>
								</div>
							) : (
								messages.map(renderMessageContent)
							)}
						</div>

						<div className="px-2 py-2.5">
							<PlaceholdersAndVanishInput
								onChange={handleInputChangeWithSideEffects}
								onSubmit={(e) => {
									handleSubmit(e);
									if (!isOpen) setIsOpen(true);
								}}
								value={input}
								// disabled={isLoading}
								className={cn("transition-all duration-300")}
								showSparkle={true} // Always show sparkle
								onFocus={handleInputFocus}
								isOpen={isOpen}
								inputRef={inputRef}
							/>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{showPrompts && (
				<div
					className={cn(
						"mx-4 mt-4 hidden max-w-4xl transform-none opacity-100 transition-all duration-300 ease-in-out md:block lg:mx-auto",
					)}
				>
					<div className="mb-2 flex flex-row items-end gap-2">
						{suggestions.map((suggestion) => (
							<button
								key={suggestion}
								type="button"
								onClick={() => handleSuggestionClick(suggestion)}
								className="max-w-[85%] cursor-pointer whitespace-nowrap rounded-full border bg-gray-100 px-4 py-2 text-left text-foreground text-xs shadow-md transition-colors hover:bg-gray-200"
							>
								{suggestion}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
