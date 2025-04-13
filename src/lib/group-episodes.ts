import { format, isAfter, parse, subYears } from "date-fns";
import type { GroupedEpisodes } from "~/types/group-episodes";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { nonNullable } from "~/utils/functions";
import {
	removeSingleLetterWords,
	removeNumbers,
	removeSpecialCharacters,
	removeStopWords,
} from "~/utils/string-utils";

export function groupEpisodes(items: RSSBasicEpisode[]): GroupedEpisodes[] {
	if (items.length < 10) {
		return [];
	}

	const dataItems = items.filter(
		(item) => item.title?.trim && item.title.trim().length > 0,
	);

	const countTitlesWithColon = dataItems.filter((title) =>
		title.title?.includes(":"),
	).length;
	const countTitlesWithDash = dataItems.filter((title) =>
		title.title?.includes("-"),
	).length;

	const groups: Record<
		string,
		{
			values: string[];
			titles: string[];
			latestPublishedDate: Date;
		}
	> = {};

	const separator = countTitlesWithColon > countTitlesWithDash ? ":" : "-";

	for (const title of dataItems) {
		if (title.title?.includes(separator)) {
			let [key, value] = title.title.split(separator);

			if (key && value) {
				key = removeSingleLetterWords(
					removeStopWords(removeNumbers(removeSpecialCharacters(key))),
				);
				value = removeSingleLetterWords(
					removeStopWords(removeNumbers(removeSpecialCharacters(value))),
				);

				if (!groups[key]) {
					groups[key] = {
						values: [],
						titles: [],
						latestPublishedDate: subYears(new Date(), 100),
					};
				}

				groups[key]?.values.push(value);
				groups[key]?.titles.push(title.title);

				if (
					title.published &&
					isAfter(
						new Date(title.published),
						groups[key]?.latestPublishedDate ?? new Date(),
					)
				) {
					// biome-ignore lint/style/noNonNullAssertion: it's safe to do here
					groups[key]!.latestPublishedDate = new Date(title.published);
				}
			}
		}
	}

	const validGroups = Object.keys(groups)
		.filter(
			(key) =>
				groups[key]?.values.length &&
				groups[key].values.length > 5 &&
				key.length > 0,
		)
		.map((key) => ({
			key,
			count: groups[key]?.values.length ?? 0,
			titles: groups[key]?.titles ?? [],
			latestPublishedDate: groups[key]?.latestPublishedDate ?? new Date(),
		}));

	if (validGroups.length === 0) {
		const publishedDates = items
			.map((item) => (item.published ? new Date(item.published) : null))
			.filter(nonNullable) as Date[];

		const weekDates = publishedDates.map((date) => format(date, "EEEE"));
		const uniqueWeekDates = [...new Set(weekDates)];

		const groupByWeekDate = uniqueWeekDates.map((date) => {
			const groupItems = items.filter(
				(item) =>
					item.published && format(new Date(item.published), "EEEE") === date,
			);

			return {
				date,
				count: publishedDates.filter((d: Date) => format(d, "EEEE") === date)
					.length,
				titles: groupItems.map((item) => item.title ?? "") ?? [],
				latestPublishedDate:
					groupItems
						.map((item) => (item.published ? new Date(item.published) : null))
						.filter(nonNullable)
						.sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date(),
			};
		});

		// Group dates if count is less than 10%
		const groupedDates = groupByWeekDate.filter(
			(group) => group.count > 0.1 * dataItems.length,
		);

		if (groupedDates.length < groupByWeekDate.length) {
			const groupItems = dataItems.filter(
				(item) =>
					!groupedDates.some((group) =>
						group.titles.includes(item.title ?? ""),
					),
			);

			groupedDates.push({
				date: "Extras",
				count: groupItems.length,
				titles: groupItems.map((item) => item.title ?? ""),
				latestPublishedDate:
					groupItems
						.map((item) => (item.published ? new Date(item.published) : null))
						.filter(nonNullable)
						.sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date(),
			});
		}

		const allWeekGroups = groupedDates
			.filter((group) => group.date !== "Extras")
			.map((group) => format(parse(group.date, "EEEE", new Date()), "e"))
			.join("");

		for (const group of groupedDates) {
			validGroups.push({
				key:
					group.date === "Extras"
						? `@e${allWeekGroups}-${group.date}`
						: `@w-${group.date}`,
				count: group.count,
				titles: group.titles,
				latestPublishedDate: group.latestPublishedDate,
			});
		}
	}

	return validGroups.sort(
		(a, b) => b.latestPublishedDate.getTime() - a.latestPublishedDate.getTime(),
	);
}
