import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { AudioPlayer } from "~/components/audio-player";
import { NavBar } from "~/components/nav-bar";
import { Toaster } from "~/components/ui/sonner";
import { AudioPlayerProvider } from "~/contexts/audio-player-context";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "Wavelength",
	description: "Discover, listen, and chat with podcasts",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClerkProvider dynamic>
				<html lang="en">
					<body className={`${geist.variable} antialiased`}>
						<TRPCReactProvider>
							<NuqsAdapter>
								<AudioPlayerProvider>
									<div className="min-h-screen pb-96">
										<NavBar />

										{children}
									</div>

									<Toaster position="top-center" />

									<AudioPlayer />
								</AudioPlayerProvider>
							</NuqsAdapter>
						</TRPCReactProvider>
					</body>
				</html>
			</ClerkProvider>
		</Suspense>
	);
}
