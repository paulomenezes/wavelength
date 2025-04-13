export const STOP_WORDS = new Set([
	"the",
	"a",
	"of",
	"to",
	"and",
	"in",
	"for",
	"on",
	"with",
	"episode",
	"bonus",
	"show",
	"podcast",
	"from",
	"by",
	"at",
	"an",
	"is",
	"it's",
	"this",
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december",
	"jan",
	"feb",
	"mar",
	"apr",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat",
	"sun",
	"part",
]);

export function removeSpecialCharacters(str: string) {
	return str.replace(/'/g, "").replace(/"/g, "").replace(".", "").trim();
}

export function removeNumbers(str: string) {
	return str.replace(/\d+/g, "").trim();
}

export function removeStopWords(str: string) {
	return STOP_WORDS.has(str.toLowerCase()) ? "" : str;
}

export function removeSingleLetterWords(str: string) {
	return str
		.split(" ")
		.filter((word) => word.length > 1)
		.join(" ");
}

export function encodeToBase64(str: string): string {
	if (typeof Buffer !== "undefined") {
		return Buffer.from(str).toString("base64");
	}

	return btoa(encodeURIComponent(str));
}

export function decodeFromBase64(str: string): string {
	if (typeof Buffer !== "undefined") {
		return Buffer.from(str, "base64").toString();
	}

	return decodeURIComponent(atob(str));
}
