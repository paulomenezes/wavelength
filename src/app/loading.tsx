import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex h-full min-h-screen w-full items-center justify-center">
			<Loader2 className="size-4 animate-spin" />
		</div>
	);
}
