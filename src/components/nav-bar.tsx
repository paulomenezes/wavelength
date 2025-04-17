"use client";

import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
} from "@clerk/nextjs";
import {
	AudioWaveformIcon,
	Library,
	ListIcon,
	LogInIcon,
	LogOutIcon,
	PlayIcon,
	PodcastIcon,
	SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { PodcastChat } from "./chat";
import { NavBarChatTrigger } from "./chat-trigger";
import { Button, buttonVariants } from "./ui/button";

export function NavBar() {
	const { user } = useUser();
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-40 border-gray-200 border-b bg-white shadow-sm">
			<div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between px-4">
				<div className="flex items-center gap-8">
					<Link href="/" className="flex items-center gap-2">
						<AudioWaveformIcon className="size-6 text-primary" />
						<span className="font-bold text-xl">Wavelength</span>
					</Link>

					<nav className="hidden md:block">
						<div className="flex items-center gap-6">
							{user?.id && (
								<Link
									href="/"
									className={buttonVariants({
										variant: pathname === "/" ? "tertiary" : "outline",
									})}
								>
									<PodcastIcon className="size-4" />
									Library
								</Link>
							)}
							<Link
								href={user?.id ? "/discover" : "/"}
								className={buttonVariants({
									variant: pathname === "/discover" ? "tertiary" : "outline",
								})}
							>
								<SearchIcon className="size-4" />
								Discover
							</Link>
							<Link
								href="/categories"
								className={buttonVariants({
									variant: pathname === "/categories" ? "tertiary" : "outline",
								})}
							>
								<ListIcon className="size-4" />
								Categories
							</Link>
							<Link
								href="/up-next"
								className={buttonVariants({
									variant: pathname === "/up-next" ? "tertiary" : "outline",
								})}
							>
								<PlayIcon className="size-4" />
								Up Next
							</Link>
							{/* <Link
								href="/activity"
								className={buttonVariants({ variant: "outline" })}
							>
								Activity
							</Link> */}
						</div>
					</nav>
				</div>

				<div className="flex items-center gap-2">
					{pathname !== "/" && pathname !== "/discover" && (
						<div>
							<ChatHistory />
						</div>
					)}

					<SignedOut>
						<SignInButton>
							<Button variant="outline">
								<LogInIcon />
								Sign In
							</Button>
						</SignInButton>
						<SignUpButton>
							<Button variant="outline">
								<LogOutIcon />
								Sign Up
							</Button>
						</SignUpButton>
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</div>
		</header>
	);
}

function ChatHistory() {
	const chatHistory = api.chat.getChatHistory.useQuery(void 0, {
		refetchInterval: 1000,
		staleTime: 0,
	});

	if (chatHistory.isLoading) {
		return <div className="h-8 w-8 rounded-md bg-black" />;
	}

	return (
		<PodcastChat chatHistory={chatHistory.data}>
			<NavBarChatTrigger />
		</PodcastChat>
	);
}
