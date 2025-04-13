"use client";

import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function NavBar() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

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
