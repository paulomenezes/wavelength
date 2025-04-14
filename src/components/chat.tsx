"use client";

import type React from "react";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { Search, X } from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
	ChatPodcastMessage,
	ChatTextMessage,
} from "~/components/chat-messages";
import { PlaceholdersAndVanishInput } from "~/components/placeholder-input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useAudioPlayer } from "~/contexts/audio-player-context";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function PodcastChat() {
	const { currentEpisode } = useAudioPlayer();
	const [isOpen, setIsOpen] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [inputMode, setInputMode] = useState<"text" | "voice">("text");
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

	// Placeholder texts to rotate through
	const placeholders = [
		"Search for podcasts about technology...",
		"Find true crime podcasts...",
		"Ask for podcast recommendations...",
		"Discover podcasts with short episodes...",
		"Search for podcasts by topic or host...",
	];

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

	const toggleInputMode = () => {
		setInputMode(inputMode === "text" ? "voice" : "text");
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
		<>
			<div className="fixed right-0 bottom-0 hidden h-72 w-[500px] bg-gradient-to-br from-transparent via-transparent to-muted lg:block" />

			{/* Chat body - floating above the input when open */}
			<div
				className={cn(
					"fixed right-8 z-30 h-[650px] w-[350px] transition-all duration-300 ease-in-out sm:w-[416px]",
					currentEpisode ? "bottom-[136px]" : "bottom-8",
					isOpen
						? "transform-none opacity-100"
						: "pointer-events-none translate-y-4 opacity-0",
				)}
			>
				<Card className="relative flex h-full w-full flex-col gap-1 overflow-hidden border bg-gray-50 py-0 pb-16 shadow-sm">
					<div className="flex items-center justify-end p-3">
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleChat}
							className="h-8 w-8"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<CardContent
						ref={chatContainerRef}
						className="flex-1 space-y-3 overflow-y-auto p-3"
					>
						{messages.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
								<Search className="mb-3 h-10 w-10 opacity-50" />
								<p className="font-medium text-base">
									Search for podcasts or ask questions
								</p>
								<p className="text-xs">
									Try "Find podcasts about AI" or "What are trending podcasts?"
								</p>
							</div>
						) : (
							messages.map(renderMessageContent)
						)}
						{/* {isLoading && (
							<div className="flex justify-start">
								<div className="max-w-[80%] rounded-lg bg-muted px-3 py-2">
									<div className="flex space-x-2">
										<div
											className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style={{ animationDelay: "0ms" }}
										/>
										<div
											className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style={{ animationDelay: "150ms" }}
										/>
										<div
											className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style={{ animationDelay: "300ms" }}
										/>
									</div>
								</div>
							</div>
						)} */}
					</CardContent>
				</Card>
			</div>

			{/* Suggestion bubbles */}
			<div
				className={cn(
					"fixed right-10 z-50 w-[350px] transition-all duration-300 ease-in-out sm:w-[400px]",
					currentEpisode ? "bottom-[204px]" : "bottom-[100px]",
					showSuggestions
						? "transform-none opacity-100"
						: "pointer-events-none translate-y-4 opacity-0",
				)}
			>
				<div className="mb-2 flex flex-col items-end space-y-2">
					{suggestions.map((suggestion, index) => (
						<button
							key={suggestion}
							type="button"
							onClick={() => handleSuggestionClick(suggestion)}
							className="max-w-[85%] cursor-pointer rounded-full border bg-gray-100 px-4 py-2 text-left text-foreground text-sm shadow-md transition-colors hover:bg-gray-200"
						>
							{suggestion}
						</button>
					))}
				</div>
			</div>

			{/* Input area with mic toggle */}
			<div
				className={cn(
					"fixed right-10 z-40 flex items-center",
					currentEpisode ? "bottom-[146px]" : "bottom-[42px]",
				)}
			>
				{/* Animated input field */}
				{inputMode === "text" && (
					<PlaceholdersAndVanishInput
						placeholders={placeholders}
						onChange={handleInputChangeWithSideEffects}
						onSubmit={(e) => {
							handleSubmit(e);
							if (!isOpen) setIsOpen(true);
						}}
						value={input}
						// disabled={isLoading}
						className={cn(
							"transition-all duration-300",
							isOpen || showSuggestions
								? "w-[300px] sm:w-[400px]"
								: "w-[250px] sm:w-[400px]",
						)}
						showSparkle={true} // Always show sparkle
						onFocus={handleInputFocus}
						isOpen={isOpen}
						inputRef={inputRef}
					/>
				)}

				{/* Mic toggle button */}
				{/* <Button
					onClick={toggleInputMode}
					variant={inputMode === "voice" ? "destructive" : "outline"}
					size="icon"
					className={cn(
						"ml-2 h-12 w-12 rounded-full shadow-md",
						inputMode === "voice" ? "bg-red-500 hover:bg-red-600" : "",
					)}
				>
					<Mic className="h-5 w-5" />
				</Button> */}
			</div>
		</>
	);
}
