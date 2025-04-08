import {
	Atom,
	Baby,
	BookMarked,
	BookOpen,
	Briefcase,
	Building,
	Cctv,
	Church,
	Clapperboard,
	Cpu,
	GalleryVerticalEnd,
	GraduationCap,
	Heart,
	History,
	MicVocal,
	Music,
	Newspaper,
	Speech,
	Volleyball,
} from "lucide-react";
import type { Genre } from "~/graphql/generated";

export const genreConfig: Partial<
	Record<Genre, { label: string; icon: React.ElementType }>
> = {
	PODCASTSERIES_ARTS: { label: "Arts", icon: BookOpen },
	PODCASTSERIES_BUSINESS: { label: "Business", icon: Briefcase },
	PODCASTSERIES_COMEDY: { label: "Comedy", icon: MicVocal },
	PODCASTSERIES_EDUCATION: { label: "Education", icon: GraduationCap },
	PODCASTSERIES_FICTION: { label: "Fiction", icon: BookMarked },
	PODCASTSERIES_GOVERNMENT: { label: "Government", icon: Building },
	PODCASTSERIES_HISTORY: { label: "History", icon: History },
	PODCASTSERIES_HEALTH_AND_FITNESS: { label: "Health & Fitness", icon: Heart },
	PODCASTSERIES_KIDS_AND_FAMILY: { label: "Kids & Family", icon: Baby },
	PODCASTSERIES_LEISURE: { label: "Leisure", icon: GalleryVerticalEnd },
	PODCASTSERIES_MUSIC: { label: "Music", icon: Music },
	PODCASTSERIES_NEWS: { label: "News", icon: Newspaper },
	PODCASTSERIES_RELIGION_AND_SPIRITUALITY: {
		label: "Religion & Spirituality",
		icon: Church,
	},
	PODCASTSERIES_SCIENCE: { label: "Science", icon: Atom },
	PODCASTSERIES_SOCIETY_AND_CULTURE: {
		label: "Society & Culture",
		icon: Speech,
	},
	PODCASTSERIES_SPORTS: { label: "Sports", icon: Volleyball },
	PODCASTSERIES_TECHNOLOGY: { label: "Technology", icon: Cpu },
	PODCASTSERIES_TRUE_CRIME: { label: "True Crime", icon: Cctv },
	PODCASTSERIES_TV_AND_FILM: { label: "TV & Film", icon: Clapperboard },
};
