import type React from "react";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

import { UpNext } from "~/components/up-next";
import { api } from "~/trpc/server";

export default function UpNextPage() {
	return (
		<div className="min-h-screen bg-white">
			<div className="mx-auto max-w-[96rem] px-4 py-8">
				<Suspense
					fallback={
						<>
							<div className="mb-8 flex items-center justify-between">
								<h1 className="font-bold text-3xl">Up Next</h1>
							</div>

							<div className="grid grid-cols-1 gap-7">
								{Array.from({ length: 10 }).map((_, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<Skeleton key={index} className="h-[148px] w-full" />
								))}
							</div>
						</>
					}
				>
					<UpNextPageContent />
				</Suspense>
			</div>
		</div>
	);
}

async function UpNextPageContent() {
	const queue = await api.queue.getQueue();

	return <UpNext data={queue} />;
}
