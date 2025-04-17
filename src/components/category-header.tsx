"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { genreConfig } from "~/utils/categories";
import { HOMEPAGE_GENRES } from "~/utils/consts";

export function CategoryHeader() {
	const [activeSection, setActiveSection] = useState("trending");

	// Function to handle smooth scrolling
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
			setActiveSection(sectionId);
		}
	};

	// Update active section based on scroll position
	useEffect(() => {
		function handleScroll() {
			for (const sectionId of ["trending", ...HOMEPAGE_GENRES]) {
				const section = document.getElementById(sectionId);

				if (section) {
					const rect = section.getBoundingClientRect();
					// If the section is in view (with some buffer for the sticky header)
					if (rect.top <= 150 && rect.bottom >= 150) {
						setActiveSection(sectionId);
						break;
					}
				}
			}
		}

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="sticky top-[65px] z-40 border-gray-200 border-b bg-gray-50 px-4 py-4">
			<div className="hide-scrollbar no-scrollbar mx-auto flex max-w-[96rem] overflow-x-auto px-4">
				<div className="flex items-center gap-6 font-medium text-lg">
					<button
						type="button"
						onClick={() => scrollToSection("trending")}
						className={`whitespace-nowrap ${activeSection === "trending" ? "border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
					>
						Trending
					</button>
					{HOMEPAGE_GENRES.map((genre) => (
						<button
							key={genre}
							type="button"
							onClick={() => scrollToSection(genre)}
							className={`whitespace-nowrap ${activeSection === genre ? "border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
						>
							{genreConfig[genre]?.label}
						</button>
					))}
					<Link
						href="/categories"
						className="whitespace-nowrap text-gray-500 hover:text-gray-900"
					>
						More
					</Link>
				</div>
			</div>
		</div>
	);
}
