import type { UIMessage } from "ai";
import Link from "next/link";
import { cn } from "~/lib/utils";

export function ChatTextMessage({
	messageRole,
	content,
}: {
	messageRole: UIMessage["role"];
	content: UIMessage["content"];
}) {
	return (
		<div
			className={cn(
				"flex",
				messageRole === "user" ? "justify-end" : "justify-start",
			)}
		>
			<div
				className={cn(
					"max-w-[80%] rounded-lg px-3 py-2",
					messageRole === "user"
						? "bg-primary text-primary-foreground"
						: "bg-muted",
				)}
			>
				<p>{content}</p>
			</div>
		</div>
	);
}

export function ChatPodcastMessage({
	uuid,
	title,
	imageUrl,
	author,
}: {
	uuid: string;
	title: string;
	imageUrl: string;
	author: string;
}) {
	return (
		<Link
			className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-1 text-left hover:bg-gray-200"
			href={`/podcast/${uuid}`}
		>
			<div className="flex-shrink-0">
				<img src={imageUrl} alt={title} className="h-12 w-12 rounded-md" />
			</div>
			<div>
				<p className="font-medium text-gray-900 text-sm">{title}</p>
				<p className="text-gray-500 text-sm">{author}</p>
			</div>
		</Link>
	);
}
