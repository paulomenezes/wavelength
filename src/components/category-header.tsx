"use client";

import { useEffect, useState } from "react";

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
		const handleScroll = () => {
			const sections = [
				"trending",
				"news",
				"comedy",
				"true-crime",
				"society-culture",
				"sports",
			];

			for (const sectionId of sections) {
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
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="sticky top-[65px] z-40 border-gray-200 border-b bg-gray-50 px-4 py-4">
			<div className="hide-scrollbar container mx-auto flex overflow-x-auto px-4">
				<div className="flex items-center gap-6 font-medium text-lg">
					<button
						type="button"
						onClick={() => scrollToSection("trending")}
						className={`whitespace-nowrap ${activeSection === "trending" ? "border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
					>
						Trending
					</button>
					<button
						type="button"
						onClick={() => scrollToSection("news")}
						className={`whitespace-nowrap ${activeSection === "news" ? "border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
					>
						News
					</button>
					<button
						type="button"
						onClick={() => scrollToSection("comedy")}
						className={`whitespace-nowrap ${activeSection === "comedy" ? "border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
					>
						Comedy
					</button>
					<button
						type="button"
						onClick={() => scrollToSection("true-crime")}
						className={`whitespace-nowrap ${activeSection === "true-crime" ? "border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
					>
						True Crime
					</button>
					<button
						type="button"
						onClick={() => scrollToSection("society-culture")}
						className={`whitespace-nowrap ${activeSection === "society-culture" ? "border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
					>
						Society & Culture
					</button>
					<button
						type="button"
						onClick={() => scrollToSection("sports")}
						className={`whitespace-nowrap ${activeSection === "sports" ? "border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
					>
						Sports
					</button>
					<button
						type="button"
						className="whitespace-nowrap text-gray-500 hover:text-gray-900"
					>
						More
					</button>
				</div>
			</div>
		</div>
	);
}
