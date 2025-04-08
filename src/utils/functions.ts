import { formatDistanceToNow } from "date-fns";

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

export function formatDuration(duration: number) {
	const minutes = Math.floor(duration / 60);
	const seconds = duration % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getDateDistance(date: number) {
	const then = new Date(date * 1000);

	return formatDistanceToNow(then, {
		addSuffix: true,
	});
}
