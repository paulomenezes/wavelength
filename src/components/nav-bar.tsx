"use client";

import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { LogInIcon, LogOutIcon, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { PodcastChat } from "./chat";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";

export function NavBar() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const pathname = usePathname();

	// Handle keyboard shortcut to open search
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Check for Cmd+K or Ctrl+K
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setIsSearchOpen(true);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const toggleSearch = () => {
		setIsSearchOpen(!isSearchOpen);
	};

	return (
		<header className="sticky top-0 z-40 border-gray-200 border-b bg-white shadow-sm">
			<div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between px-4">
				<div className="flex items-center gap-8">
					<Link href="/" className="flex items-center gap-2">
						<div className="h-8 w-8 rounded-md bg-black" />
						<span className="sr-only">Podcast App</span>
					</Link>

					<nav className="hidden md:block">
						<ul className="flex items-center gap-6">
							<li>
								<Link href="/" className="text-gray-700 hover:text-gray-900">
									Discover
								</Link>
							</li>
							<li>
								<Link
									href="/categories"
									className="text-gray-700 hover:text-gray-900"
								>
									Categories
								</Link>
							</li>
							<li>
								<Link
									href="/up-next"
									className="text-gray-700 hover:text-gray-900"
								>
									Up Next
								</Link>
							</li>
							<li>
								<Link
									href="/activity"
									className="text-gray-700 hover:text-gray-900"
								>
									Activity
								</Link>
							</li>
						</ul>
					</nav>
				</div>

				<div className="flex items-center gap-2">
					<PodcastChat>
						<DialogTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className={cn(
									"relative mr-4 h-9 w-9 p-0 lg:w-60 lg:justify-start lg:px-3",
									pathname === "/" && "hidden",
								)}
							>
								<Search className="h-4 w-4 xl:mr-2" />
								<span className="hidden lg:inline-flex">
									Search podcasts...
								</span>
								<kbd className="-translate-y-1/2 absolute top-1/2 right-2 hidden h-5 transform select-none items-center gap-1 rounded-full border bg-muted px-2 font-medium font-mono text-[10px] text-muted-foreground opacity-100 lg:inline-flex">
									<span className="pt-[0.5px] text-xs">⌘</span>K
								</kbd>
							</Button>
						</DialogTrigger>
					</PodcastChat>

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
