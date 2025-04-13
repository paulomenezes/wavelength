// @ts-nocheck
// @biome-ignore lint/suspicious/noExplicitAny: <explanation>
import type { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
	  };
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
};

/**  Chapters (Sections) that make up the podcast episode  */
export type Chapter = {
	__typename?: "Chapter";
	/**  The unique identifier for the chapter  */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  The start timecode of the chapter in milliseconds  */
	startTimecode?: Maybe<Scalars["Int"]["output"]>;
	/**  The title of the chapter  */
	title?: Maybe<Scalars["String"]["output"]>;
};

/**  A url link to the chapters for an episode  */
export type ChapterLink = {
	__typename?: "ChapterLink";
	/**  If the transcript is exclusive to Taddy API Business users and you need an API key to access it  */
	isTaddyExclusive?: Maybe<Scalars["Boolean"]["output"]>;
	/**  Mime type of file  */
	type?: Maybe<Scalars["String"]["output"]>;
	/**  The url to the chapter  */
	url?: Maybe<Scalars["String"]["output"]>;
};

/**  Comic Issue Details  */
export type ComicIssue = {
	__typename?: "ComicIssue";
	/**  Stringified JSON details for the banner art. Convert to JSON to use. */
	bannerImageAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The banner art for an issue  */
	bannerImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Details on the comic for which this issue belongs to  */
	comicSeries?: Maybe<ComicSeries>;
	/**  Short note from the creator for the issue  */
	creatorNote?: Maybe<Scalars["String"]["output"]>;
	/**  Date the exclusive issue is available for everyone. (Epoch time in seconds)  */
	dateExclusiveContentIsAvailable?: Maybe<Scalars["Int"]["output"]>;
	/**  Date when the issue was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  A different hash means that details for this issue have updated since the last hash  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**  If the issue has now been removed from the SSS Feed  */
	isRemoved?: Maybe<Scalars["Boolean"]["output"]>;
	/**  The name (title) of the issue  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  Position of this issue in relation to other issues. This is used to sort issues by oldest or latest in a series.  */
	position?: Maybe<Scalars["Int"]["output"]>;
	/**  Push notification message for the issue  */
	pushNotificationMessage?: Maybe<Scalars["String"]["output"]>;
	/**  If the comic issue is only available as exclusive content, this will be the payment platforms that the user has to verify they have access to in order to view the issue  */
	scopesForExclusiveContent?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  Unique identifier for a comic series this issue belongs to  */
	seriesUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Details on all the stories that make up this issue  */
	stories?: Maybe<Array<Maybe<ComicStory>>>;
	/**  A different hash means that details for the stories that make up this issue have updated since the last hash  */
	storiesHash?: Maybe<Scalars["String"]["output"]>;
	/**  All the story images fo this issue  */
	storyImageUrls?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  Stringified JSON details for the thumbnail art. Convert to JSON to use. */
	thumbnailImageAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The thumbnail art for an issue  */
	thumbnailImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Unique identifier for a comic issue  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  Comic Issue Details  */
export type ComicIssueBannerImageUrlArgs = {
	variant?: InputMaybe<ImageVariant>;
};

/**  Comic Details  */
export type ComicSeries = {
	__typename?: "ComicSeries";
	/**  Stringified JSON details for the banner art. Convert to JSON to use. */
	bannerImageAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The banner art for a comic  */
	bannerImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Rating of the comic  */
	contentRating?: Maybe<ContentRating>;
	/**  Copyright details for this feed  */
	copyright?: Maybe<Scalars["String"]["output"]>;
	/**  Stringified JSON details for the cover art. Convert to JSON to use. */
	coverImageAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The cover art for a comic  */
	coverImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Creators of the comic  */
	creators?: Maybe<Array<Maybe<Creator>>>;
	/**  Date when the comic was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  The description for a comic  */
	description?: Maybe<Scalars["String"]["output"]>;
	/**  Details on how often the SSS feed is checked for new details  */
	feedRefreshDetails?: Maybe<FeedRefreshDetails>;
	/**  A comic can belong to multiple genres but they are listed in order of importance.  */
	genres?: Maybe<Array<Maybe<Genre>>>;
	/**  A hash of all comic details. It may be useful for you to save this property in your database and compare it to know if any comic details have updated since the last time you checked  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  HostingProvider Details  */
	hostingProvider?: Maybe<HostingProvider>;
	/**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**
	 *  If the comic is finished / complete
	 * @deprecated Use status instead.
	 */
	isCompleted?: Maybe<Scalars["Boolean"]["output"]>;
	/**  A list of issues for this comic  */
	issues?: Maybe<Array<Maybe<ComicIssue>>>;
	/**  A hash of the details for all issues for this comic. It may be useful for you to save this property in your database and compare it to know if there are any new or updated issues since the last time you checked  */
	issuesHash?: Maybe<Scalars["String"]["output"]>;
	/**  The language the comic is in  */
	language?: Maybe<Language>;
	/**  The name (title) for a comic  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  If the comic series contain issues that are only available as exclusive content, this will be the payment platforms that the user has to verify they have access to in order to view the issue  */
	scopesForExclusiveContent?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  Layout of the comic  */
	seriesLayout?: Maybe<ComicSeriesLayout>;
	/**  Type of the comic  */
	seriesType?: Maybe<ComicSeriesType>;
	/**  Name to use for contacting the owner of this feed  */
	sssOwnerName?: Maybe<Scalars["String"]["output"]>;
	/**  Email to use for contacting the owner of this feed  */
	sssOwnerPublicEmail?: Maybe<Scalars["String"]["output"]>;
	/**  Url for the comic's SSS feed  */
	sssUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Status of the comic  */
	status?: Maybe<SeriesStatus>;
	/**  Tags for the comic  */
	tags?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  Stringified JSON details for the thumbnail art. Convert to JSON to use. */
	thumbnailImageAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The thumbnail art for a comic  */
	thumbnailImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The number of issues for this comic  */
	totalIssuesCount?: Maybe<Scalars["Int"]["output"]>;
	/**  Unique identifier for this comic  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  Comic Details  */
export type ComicSeriesBannerImageUrlArgs = {
	variant?: InputMaybe<ImageVariant>;
};

/**  Comic Details  */
export type ComicSeriesCoverImageUrlArgs = {
	variant?: InputMaybe<ImageVariant>;
};

/**  Comic Details  */
export type ComicSeriesIssuesArgs = {
	includeRemovedIssues?: InputMaybe<Scalars["Boolean"]["input"]>;
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	searchTerm?: InputMaybe<Scalars["String"]["input"]>;
	sortOrder?: InputMaybe<SortOrder>;
};

/**  Comic Details  */
export type ComicSeriesTotalIssuesCountArgs = {
	includeRemovedIssues?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  Layout of Comic Series  */
export enum ComicSeriesLayout {
	LeftToRight = "LEFT_TO_RIGHT",
	Page = "PAGE",
	RightToLeft = "RIGHT_TO_LEFT",
	VerticalScrollTopToBottom = "VERTICAL_SCROLL_TOP_TO_BOTTOM",
}

/**  Type of Comic Series  */
export enum ComicSeriesType {
	AmericanStyleComic = "AMERICAN_STYLE_COMIC",
	Anthology = "ANTHOLOGY",
	GraphicNovel = "GRAPHIC_NOVEL",
	Manga = "MANGA",
	Manhua = "MANHUA",
	Manhwa = "MANHWA",
	OneShot = "ONE_SHOT",
	Webtoon = "WEBTOON",
}

/**  Comic Story Details  */
export type ComicStory = {
	__typename?: "ComicStory";
	/**  Details on the comic issue that this story belongs to  */
	comicIssue?: Maybe<ComicIssue>;
	/**  Details on the comic series that this story belongs to  */
	comicSeries?: Maybe<ComicSeries>;
	/**  A different hash means that details for this story have updated since the last hash  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  If the story has now been removed from the SSS Feed  */
	isRemoved?: Maybe<Scalars["Boolean"]["output"]>;
	/**  Unique identifier for a comic issue this story belongs to  */
	issueUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Unique identifier for a comic series this story belongs to  */
	seriesUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Stringified JSON details for the story art. Convert to JSON to use. */
	storyImageAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The story art  */
	storyImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Unique identifier for a comic story  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  Details on all internal series  */
export type ContentInternalSeriesList = {
	__typename?: "ContentInternalSeriesList";
	/**  The content type  */
	contentType?: Maybe<Scalars["String"]["output"]>;
	/**  The content uuid  */
	contentUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  List of internal comic series  */
	internalcomicseries?: Maybe<Array<Maybe<InternalComicSeries>>>;
	/**  List of creator feeds  */
	internalcreators?: Maybe<Array<Maybe<InternalCreator>>>;
};

/**  Content rating for different media types. Follows format: TYPE_RATING  */
export enum ContentRating {
	ComicseriesAdults = "COMICSERIES_ADULTS",
	ComicseriesBaby = "COMICSERIES_BABY",
	ComicseriesErotica = "COMICSERIES_EROTICA",
	ComicseriesKids = "COMICSERIES_KIDS",
	ComicseriesMatureTeens = "COMICSERIES_MATURE_TEENS",
	/** @deprecated Use COMICSERIES_EROTICA instead */
	ComicseriesPornography = "COMICSERIES_PORNOGRAPHY",
	ComicseriesTeens = "COMICSERIES_TEENS",
}

/**  Content roles for different media types. Follows format: TYPE_ROLE_SUBROLE  */
export enum ContentRole {
	ComicseriesArtist = "COMICSERIES_ARTIST",
	ComicseriesArtistColorist = "COMICSERIES_ARTIST_COLORIST",
	ComicseriesArtistInker = "COMICSERIES_ARTIST_INKER",
	ComicseriesArtistLetterer = "COMICSERIES_ARTIST_LETTERER",
	ComicseriesArtistPenciler = "COMICSERIES_ARTIST_PENCILER",
	ComicseriesEditor = "COMICSERIES_EDITOR",
	ComicseriesProducer = "COMICSERIES_PRODUCER",
	ComicseriesTranslator = "COMICSERIES_TRANSLATOR",
	ComicseriesWriter = "COMICSERIES_WRITER",
	PodcastseriesAnnouncer = "PODCASTSERIES_ANNOUNCER",
	PodcastseriesAssistantCamera = "PODCASTSERIES_ASSISTANT_CAMERA",
	PodcastseriesAssistantDirector = "PODCASTSERIES_ASSISTANT_DIRECTOR",
	PodcastseriesAssistantEditor = "PODCASTSERIES_ASSISTANT_EDITOR",
	PodcastseriesAssociateProducer = "PODCASTSERIES_ASSOCIATE_PRODUCER",
	PodcastseriesAudioEditor = "PODCASTSERIES_AUDIO_EDITOR",
	PodcastseriesAudioEngineer = "PODCASTSERIES_AUDIO_ENGINEER",
	PodcastseriesAuthor = "PODCASTSERIES_AUTHOR",
	PodcastseriesBookingCoordinator = "PODCASTSERIES_BOOKING_COORDINATOR",
	PodcastseriesCameraGrip = "PODCASTSERIES_CAMERA_GRIP",
	PodcastseriesCameraOperator = "PODCASTSERIES_CAMERA_OPERATOR",
	PodcastseriesComposer = "PODCASTSERIES_COMPOSER",
	PodcastseriesContentManager = "PODCASTSERIES_CONTENT_MANAGER",
	PodcastseriesCoverArtDesigner = "PODCASTSERIES_COVER_ART_DESIGNER",
	PodcastseriesCoHost = "PODCASTSERIES_CO_HOST",
	PodcastseriesCoWriter = "PODCASTSERIES_CO_WRITER",
	PodcastseriesCreativeDirector = "PODCASTSERIES_CREATIVE_DIRECTOR",
	PodcastseriesDevelopmentProducer = "PODCASTSERIES_DEVELOPMENT_PRODUCER",
	PodcastseriesDirector = "PODCASTSERIES_DIRECTOR",
	PodcastseriesEditor = "PODCASTSERIES_EDITOR",
	PodcastseriesEditorialDirector = "PODCASTSERIES_EDITORIAL_DIRECTOR",
	PodcastseriesExecutiveProducer = "PODCASTSERIES_EXECUTIVE_PRODUCER",
	PodcastseriesFactChecker = "PODCASTSERIES_FACT_CHECKER",
	PodcastseriesFoleyArtist = "PODCASTSERIES_FOLEY_ARTIST",
	PodcastseriesGraphicDesigner = "PODCASTSERIES_GRAPHIC_DESIGNER",
	PodcastseriesGuest = "PODCASTSERIES_GUEST",
	PodcastseriesGuestHost = "PODCASTSERIES_GUEST_HOST",
	PodcastseriesGuestWriter = "PODCASTSERIES_GUEST_WRITER",
	PodcastseriesHost = "PODCASTSERIES_HOST",
	PodcastseriesLightingDesigner = "PODCASTSERIES_LIGHTING_DESIGNER",
	PodcastseriesLogger = "PODCASTSERIES_LOGGER",
	PodcastseriesManagingEditor = "PODCASTSERIES_MANAGING_EDITOR",
	PodcastseriesMarketingManager = "PODCASTSERIES_MARKETING_MANAGER",
	PodcastseriesMiscConsultant = "PODCASTSERIES_MISC_CONSULTANT",
	PodcastseriesMiscIntern = "PODCASTSERIES_MISC_INTERN",
	PodcastseriesMusicContributor = "PODCASTSERIES_MUSIC_CONTRIBUTOR",
	PodcastseriesMusicProduction = "PODCASTSERIES_MUSIC_PRODUCTION",
	PodcastseriesNarrator = "PODCASTSERIES_NARRATOR",
	PodcastseriesPostProductionEngineer = "PODCASTSERIES_POST_PRODUCTION_ENGINEER",
	PodcastseriesProducer = "PODCASTSERIES_PRODUCER",
	PodcastseriesProductionAssistant = "PODCASTSERIES_PRODUCTION_ASSISTANT",
	PodcastseriesProductionCoordinator = "PODCASTSERIES_PRODUCTION_COORDINATOR",
	PodcastseriesRemoteRecordingEngineer = "PODCASTSERIES_REMOTE_RECORDING_ENGINEER",
	PodcastseriesReporter = "PODCASTSERIES_REPORTER",
	PodcastseriesResearcher = "PODCASTSERIES_RESEARCHER",
	PodcastseriesSalesManager = "PODCASTSERIES_SALES_MANAGER",
	PodcastseriesSalesRepresentative = "PODCASTSERIES_SALES_REPRESENTATIVE",
	PodcastseriesScriptCoordinator = "PODCASTSERIES_SCRIPT_COORDINATOR",
	PodcastseriesScriptEditor = "PODCASTSERIES_SCRIPT_EDITOR",
	PodcastseriesSeniorProducer = "PODCASTSERIES_SENIOR_PRODUCER",
	PodcastseriesSocialMediaManager = "PODCASTSERIES_SOCIAL_MEDIA_MANAGER",
	PodcastseriesSongwriter = "PODCASTSERIES_SONGWRITER",
	PodcastseriesSoundDesigner = "PODCASTSERIES_SOUND_DESIGNER",
	PodcastseriesStoryEditor = "PODCASTSERIES_STORY_EDITOR",
	PodcastseriesStudioCoordinator = "PODCASTSERIES_STUDIO_COORDINATOR",
	PodcastseriesTechnicalDirector = "PODCASTSERIES_TECHNICAL_DIRECTOR",
	PodcastseriesTechnicalManager = "PODCASTSERIES_TECHNICAL_MANAGER",
	PodcastseriesThemeMusic = "PODCASTSERIES_THEME_MUSIC",
	PodcastseriesTranscriber = "PODCASTSERIES_TRANSCRIBER",
	PodcastseriesTranslator = "PODCASTSERIES_TRANSLATOR",
	PodcastseriesVoiceActor = "PODCASTSERIES_VOICE_ACTOR",
	PodcastseriesWriter = "PODCASTSERIES_WRITER",
}

/**  Countries (ISO 3166-1 https://en.wikipedia.org/wiki/ISO_3166-1)  */
export enum Country {
	Afghanistan = "AFGHANISTAN",
	AlandIslands = "ALAND_ISLANDS",
	Albania = "ALBANIA",
	Algeria = "ALGERIA",
	AmericanSamoa = "AMERICAN_SAMOA",
	Andorra = "ANDORRA",
	Angola = "ANGOLA",
	Anguilla = "ANGUILLA",
	Antarctica = "ANTARCTICA",
	AntiguaAndBarbuda = "ANTIGUA_AND_BARBUDA",
	Argentina = "ARGENTINA",
	Armenia = "ARMENIA",
	Aruba = "ARUBA",
	Australia = "AUSTRALIA",
	Austria = "AUSTRIA",
	Azerbaijan = "AZERBAIJAN",
	Bahamas = "BAHAMAS",
	Bahrain = "BAHRAIN",
	Bangladesh = "BANGLADESH",
	Barbados = "BARBADOS",
	Belarus = "BELARUS",
	Belgium = "BELGIUM",
	Belize = "BELIZE",
	Benin = "BENIN",
	Bermuda = "BERMUDA",
	Bhutan = "BHUTAN",
	BoliviaPlurinationalStateOf = "BOLIVIA_PLURINATIONAL_STATE_OF",
	BonaireSintEustatiusAndSaba = "BONAIRE_SINT_EUSTATIUS_AND_SABA",
	BosniaAndHerzegovina = "BOSNIA_AND_HERZEGOVINA",
	Botswana = "BOTSWANA",
	BouvetIsland = "BOUVET_ISLAND",
	Brazil = "BRAZIL",
	BritishIndianOceanTerritoryThe = "BRITISH_INDIAN_OCEAN_TERRITORY_THE",
	BruneiDarussalam = "BRUNEI_DARUSSALAM",
	Bulgaria = "BULGARIA",
	BurkinaFaso = "BURKINA_FASO",
	Burundi = "BURUNDI",
	CaboVerde = "CABO_VERDE",
	Cambodia = "CAMBODIA",
	Cameroon = "CAMEROON",
	Canada = "CANADA",
	CaymanIslands = "CAYMAN_ISLANDS",
	CentralAfricanRepublic = "CENTRAL_AFRICAN_REPUBLIC",
	Chad = "CHAD",
	Chile = "CHILE",
	China = "CHINA",
	ChristmasIsland = "CHRISTMAS_ISLAND",
	CocosKeelingIslands = "COCOS_KEELING_ISLANDS",
	Colombia = "COLOMBIA",
	Comoros = "COMOROS",
	Congo = "CONGO",
	CongoTheDemocraticRepublicOf = "CONGO_THE_DEMOCRATIC_REPUBLIC_OF",
	CookIslands = "COOK_ISLANDS",
	CostaRica = "COSTA_RICA",
	CoteDIvoire = "COTE_D_IVOIRE",
	Croatia = "CROATIA",
	Cuba = "CUBA",
	Curacao = "CURACAO",
	Cyprus = "CYPRUS",
	Czechia = "CZECHIA",
	Denmark = "DENMARK",
	Djibouti = "DJIBOUTI",
	Dominica = "DOMINICA",
	DominicanRepublic = "DOMINICAN_REPUBLIC",
	Ecuador = "ECUADOR",
	Egypt = "EGYPT",
	ElSalvador = "EL_SALVADOR",
	EquatorialGuinea = "EQUATORIAL_GUINEA",
	Eritrea = "ERITREA",
	Estonia = "ESTONIA",
	Eswatini = "ESWATINI",
	Ethiopia = "ETHIOPIA",
	FalklandIslandsTheMalvinas = "FALKLAND_ISLANDS_THE_MALVINAS",
	FaroeIslands = "FAROE_ISLANDS",
	Fiji = "FIJI",
	Finland = "FINLAND",
	France = "FRANCE",
	FrenchGuiana = "FRENCH_GUIANA",
	FrenchPolynesia = "FRENCH_POLYNESIA",
	FrenchSouthernTerritories = "FRENCH_SOUTHERN_TERRITORIES",
	Gabon = "GABON",
	Gambia = "GAMBIA",
	Georgia = "GEORGIA",
	Germany = "GERMANY",
	Ghana = "GHANA",
	Gibraltar = "GIBRALTAR",
	Greece = "GREECE",
	Greenland = "GREENLAND",
	Grenada = "GRENADA",
	Guadeloupe = "GUADELOUPE",
	Guam = "GUAM",
	Guatemala = "GUATEMALA",
	Guernsey = "GUERNSEY",
	Guinea = "GUINEA",
	GuineaBissau = "GUINEA_BISSAU",
	Guyana = "GUYANA",
	Haiti = "HAITI",
	HeardIslandAndMcdonaldIslands = "HEARD_ISLAND_AND_MCDONALD_ISLANDS",
	HolySee = "HOLY_SEE",
	Honduras = "HONDURAS",
	HongKong = "HONG_KONG",
	Hungary = "HUNGARY",
	Iceland = "ICELAND",
	India = "INDIA",
	Indonesia = "INDONESIA",
	Iran = "IRAN",
	Iraq = "IRAQ",
	Ireland = "IRELAND",
	IsleOfMan = "ISLE_OF_MAN",
	Israel = "ISRAEL",
	Italy = "ITALY",
	Jamaica = "JAMAICA",
	Japan = "JAPAN",
	Jersey = "JERSEY",
	Jordan = "JORDAN",
	Kazakhstan = "KAZAKHSTAN",
	Kenya = "KENYA",
	Kiribati = "KIRIBATI",
	KoreaNorth = "KOREA_NORTH",
	KoreaSouth = "KOREA_SOUTH",
	Kuwait = "KUWAIT",
	Kyrgyzstan = "KYRGYZSTAN",
	LaoPeoplesDemocraticRepublicThe = "LAO_PEOPLES_DEMOCRATIC_REPUBLIC_THE",
	Latvia = "LATVIA",
	Lebanon = "LEBANON",
	Lesotho = "LESOTHO",
	Liberia = "LIBERIA",
	Libya = "LIBYA",
	Liechtenstein = "LIECHTENSTEIN",
	Lithuania = "LITHUANIA",
	Luxembourg = "LUXEMBOURG",
	Macao = "MACAO",
	Madagascar = "MADAGASCAR",
	Malawi = "MALAWI",
	Malaysia = "MALAYSIA",
	Maldives = "MALDIVES",
	Mali = "MALI",
	Malta = "MALTA",
	MarshallIslands = "MARSHALL_ISLANDS",
	Martinique = "MARTINIQUE",
	Mauritania = "MAURITANIA",
	Mauritius = "MAURITIUS",
	Mayotte = "MAYOTTE",
	Mexico = "MEXICO",
	MicronesiaFederatedStates = "MICRONESIA_FEDERATED_STATES",
	MinorOutlyingIslandsUs = "MINOR_OUTLYING_ISLANDS_US",
	MoldovaTheRepublic = "MOLDOVA_THE_REPUBLIC",
	Monaco = "MONACO",
	Mongolia = "MONGOLIA",
	Montenegro = "MONTENEGRO",
	Montserrat = "MONTSERRAT",
	Morocco = "MOROCCO",
	Mozambique = "MOZAMBIQUE",
	Myanmar = "MYANMAR",
	Namibia = "NAMIBIA",
	Nauru = "NAURU",
	Nepal = "NEPAL",
	Netherlands = "NETHERLANDS",
	NewCaledonia = "NEW_CALEDONIA",
	NewZealand = "NEW_ZEALAND",
	Nicaragua = "NICARAGUA",
	Niger = "NIGER",
	Nigeria = "NIGERIA",
	Niue = "NIUE",
	NorfolkIsland = "NORFOLK_ISLAND",
	NorthernMarianaIslands = "NORTHERN_MARIANA_ISLANDS",
	NorthMacedonia = "NORTH_MACEDONIA",
	Norway = "NORWAY",
	Oman = "OMAN",
	Pakistan = "PAKISTAN",
	Palau = "PALAU",
	PalestineState = "PALESTINE_STATE",
	Panama = "PANAMA",
	PapuaNewGuinea = "PAPUA_NEW_GUINEA",
	Paraguay = "PARAGUAY",
	Peru = "PERU",
	Philippines = "PHILIPPINES",
	Pitcairn = "PITCAIRN",
	Poland = "POLAND",
	Portugal = "PORTUGAL",
	PuertoRico = "PUERTO_RICO",
	Qatar = "QATAR",
	Reunion = "REUNION",
	Romania = "ROMANIA",
	Russia = "RUSSIA",
	Rwanda = "RWANDA",
	SaintBarthelemy = "SAINT_BARTHELEMY",
	SaintHelenaAscensionAndTristanDaCunha = "SAINT_HELENA_ASCENSION_AND_TRISTAN_DA_CUNHA",
	SaintKittsAndNevis = "SAINT_KITTS_AND_NEVIS",
	SaintLucia = "SAINT_LUCIA",
	SaintMartinFrenchPart = "SAINT_MARTIN_FRENCH_PART",
	SaintPierreAndMiquelon = "SAINT_PIERRE_AND_MIQUELON",
	SaintVincentAndTheGrenadines = "SAINT_VINCENT_AND_THE_GRENADINES",
	Samoa = "SAMOA",
	SanMarino = "SAN_MARINO",
	SaoTomeAndPrincipe = "SAO_TOME_AND_PRINCIPE",
	SaudiArabia = "SAUDI_ARABIA",
	Senegal = "SENEGAL",
	Serbia = "SERBIA",
	Seychelles = "SEYCHELLES",
	SierraLeone = "SIERRA_LEONE",
	Singapore = "SINGAPORE",
	SintMaartenDutchPart = "SINT_MAARTEN_DUTCH_PART",
	Slovakia = "SLOVAKIA",
	Slovenia = "SLOVENIA",
	SolomonIslands = "SOLOMON_ISLANDS",
	Somalia = "SOMALIA",
	SouthAfrica = "SOUTH_AFRICA",
	SouthGeorgiaAndTheSouthSandwichIslands = "SOUTH_GEORGIA_AND_THE_SOUTH_SANDWICH_ISLANDS",
	SouthSudan = "SOUTH_SUDAN",
	Spain = "SPAIN",
	SriLanka = "SRI_LANKA",
	Sudan = "SUDAN",
	Suriname = "SURINAME",
	SvalbardAndJanMayen = "SVALBARD_AND_JAN_MAYEN",
	Sweden = "SWEDEN",
	Switzerland = "SWITZERLAND",
	Syria = "SYRIA",
	Taiwan = "TAIWAN",
	Tajikistan = "TAJIKISTAN",
	Tanzania = "TANZANIA",
	Thailand = "THAILAND",
	TimorLeste = "TIMOR_LESTE",
	Togo = "TOGO",
	Tokelau = "TOKELAU",
	Tonga = "TONGA",
	TrinidadAndTobago = "TRINIDAD_AND_TOBAGO",
	Tunisia = "TUNISIA",
	Turkey = "TURKEY",
	Turkmenistan = "TURKMENISTAN",
	TurksAndCaicosIslands = "TURKS_AND_CAICOS_ISLANDS",
	Tuvalu = "TUVALU",
	Uganda = "UGANDA",
	Ukraine = "UKRAINE",
	UnitedArabEmirates = "UNITED_ARAB_EMIRATES",
	UnitedKingdom = "UNITED_KINGDOM",
	UnitedStatesOfAmerica = "UNITED_STATES_OF_AMERICA",
	Uruguay = "URUGUAY",
	Uzbekistan = "UZBEKISTAN",
	Vanuatu = "VANUATU",
	Venezuela = "VENEZUELA",
	Vietnam = "VIETNAM",
	VirginIslandsBritish = "VIRGIN_ISLANDS_BRITISH",
	VirginIslandsUs = "VIRGIN_ISLANDS_US",
	WallisAndFutuna = "WALLIS_AND_FUTUNA",
	WesternSahara = "WESTERN_SAHARA",
	Yemen = "YEMEN",
	Zambia = "ZAMBIA",
	Zimbabwe = "ZIMBABWE",
}

/**  Creator Details  */
export type Creator = {
	__typename?: "Creator";
	/**  Stringified JSON details for the avatar image. Convert to JSON to use. */
	avatarImageAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The avatar image for the creator */
	avatarImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  A short bio on the creator  */
	bio?: Maybe<Scalars["String"]["output"]>;
	/**  A list of content for this creator  */
	content?: Maybe<Array<Maybe<CreatorContent>>>;
	/**  A hash of the details for all different content a creator makes. It may be useful for you to save this property in your database and compare it to know if there are any new or updated content since the last time you checked  */
	contentHash?: Maybe<Scalars["String"]["output"]>;
	/**  Copyright details for this feed  */
	copyright?: Maybe<Scalars["String"]["output"]>;
	/**  The country in which the creator is resides in or is from  */
	country?: Maybe<Country>;
	/**  Date when the creator feed was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  Details on how often the SSS feed is checked for new details  */
	feedRefreshDetails?: Maybe<FeedRefreshDetails>;
	/**  A hash of all creator details. It may be useful for you to save this property in your database and compare it to know if any details have updated since the last time you checked  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**  Links to creator's website, email, or social media  */
	links?: Maybe<Array<Maybe<LinkDetails>>>;
	/**  Stringified JSON details for the links to creator's website, email, or social media. Convert to JSON to use. */
	linksAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The name of the creator  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  Name to use for contacting the owner of this feed  */
	sssOwnerName?: Maybe<Scalars["String"]["output"]>;
	/**  Email to use for contacting the owner of this feed  */
	sssOwnerPublicEmail?: Maybe<Scalars["String"]["output"]>;
	/**  Url for the creator's SSS feed  */
	sssUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Tags for the creator  */
	tags?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  The total number of content from this creator  */
	totalContentCount?: Maybe<Scalars["Int"]["output"]>;
	/**  Unique identifier for this creator  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  Creator Details  */
export type CreatorAvatarImageUrlArgs = {
	variant?: InputMaybe<ImageVariant>;
};

/**  Creator Details  */
export type CreatorContentArgs = {
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	sortOrder?: InputMaybe<SortOrder>;
};

/**  CreatorContent Details  */
export type CreatorContent = {
	__typename?: "CreatorContent";
	/**  Position on the content feed  */
	contentPosition?: Maybe<Scalars["Int"]["output"]>;
	/**  Content type  */
	contentType?: Maybe<TaddyType>;
	/**  Unique identifier for the content  */
	contentUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Unique identifier for the creator  */
	creatorUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  A hash of all creatorcontent details  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  Position on the creator feed  */
	position?: Maybe<Scalars["Int"]["output"]>;
	/**  Roles for the creator for this content  */
	roles?: Maybe<Array<Maybe<ContentRole>>>;
	/**  Unique identifier for this creatorcontent  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  Developer Application Details  */
export type DevApp = {
	__typename?: "DevApp";
	/**  The API key for the app (Only the owner of the app can access this) */
	apiKey?: Maybe<Scalars["String"]["output"]>;
	/**  The callback url for the app */
	callbackUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The application description */
	description?: Maybe<Scalars["String"]["output"]>;
	/**  The id for the app */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  The application logo */
	logoUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The application name */
	name?: Maybe<Scalars["String"]["output"]>;
};

/**  Documentation marketing pages for Taddy  */
export type Documentation = {
	__typename?: "Documentation";
	/**  The id corresponding to an equivalent notion page  */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  All the text in the document  */
	text?: Maybe<Scalars["String"]["output"]>;
};

/**  Feed Refresh Details  */
export type FeedRefreshDetails = {
	__typename?: "FeedRefreshDetails";
	/**  Date when the feed was refreshed last (Epoch time in seconds)  */
	dateLastRefreshed?: Maybe<Scalars["Int"]["output"]>;
	/**  How often a feed is refreshed  */
	priority?: Maybe<FeedRefreshPriority>;
	/**  The reason why feed has a LOW, INACTIVE, or NEVER priority  */
	priorityReason?: Maybe<FeedRefreshPriorityReason>;
	/**  Taddy's unique identifier  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Websub Details (if available) */
	websubDetails?: Maybe<WebsubDetails>;
};

/**  Different categories for how often a feed is refreshed  */
export enum FeedRefreshPriority {
	/**  Feed is checked every 2 hours for new updates  */
	High = "HIGH",
	/**  Feed is checked once a week for new updates  */
	Inactive = "INACTIVE",
	/**  Feed is checked once a month for new updates  */
	Low = "LOW",
	/**  Feed is checked every 6 hours for new updates  */
	Medium = "MEDIUM",
	/**  Feed is no longer checked for updates  */
	Never = "NEVER",
	/**  Feed is checked once a day for new updates  */
	Regular = "REGULAR",
	/**  Feed checked immediately (within 30 mins) after it has been updated (via a Websub notification) */
	Websub = "WEBSUB",
}

/**  The different types of reasons why a feed has a LOW, INACTIVE, or NEVER priority  */
export enum FeedRefreshPriorityReason {
	/**  There is another feed in our database that links to the same content  */
	DuplicateFeed = "DUPLICATE_FEED",
	/**  Error parsing document when trying to check the feed for new updates */
	ErrorParsingFeed = "ERROR_PARSING_FEED",
	/**  Error when trying to load the feed url (404 error, etc) */
	FeedUrlNotWorking = "FEED_URL_NOT_WORKING",
	/**  Feed has not had any updates in the last 12 months  */
	InactiveForOver_1Year = "INACTIVE_FOR_OVER_1_YEAR",
}

/**  Genres for different media types. Follows format: TYPE_GENRE_SUBGENRE  */
export enum Genre {
	ComicseriesAction = "COMICSERIES_ACTION",
	ComicseriesAnimals = "COMICSERIES_ANIMALS",
	ComicseriesBl = "COMICSERIES_BL",
	ComicseriesComedy = "COMICSERIES_COMEDY",
	ComicseriesCrime = "COMICSERIES_CRIME",
	ComicseriesDrama = "COMICSERIES_DRAMA",
	ComicseriesDystopia = "COMICSERIES_DYSTOPIA",
	ComicseriesEducational = "COMICSERIES_EDUCATIONAL",
	ComicseriesFantasy = "COMICSERIES_FANTASY",
	ComicseriesGaming = "COMICSERIES_GAMING",
	ComicseriesGl = "COMICSERIES_GL",
	ComicseriesHarem = "COMICSERIES_HAREM",
	ComicseriesHighSchool = "COMICSERIES_HIGH_SCHOOL",
	ComicseriesHistorical = "COMICSERIES_HISTORICAL",
	ComicseriesHorror = "COMICSERIES_HORROR",
	ComicseriesIsekai = "COMICSERIES_ISEKAI",
	ComicseriesLgbtq = "COMICSERIES_LGBTQ",
	ComicseriesMystery = "COMICSERIES_MYSTERY",
	ComicseriesPostApocalyptic = "COMICSERIES_POST_APOCALYPTIC",
	ComicseriesRomance = "COMICSERIES_ROMANCE",
	ComicseriesSciFi = "COMICSERIES_SCI_FI",
	ComicseriesSliceOfLife = "COMICSERIES_SLICE_OF_LIFE",
	ComicseriesSports = "COMICSERIES_SPORTS",
	ComicseriesSuperhero = "COMICSERIES_SUPERHERO",
	ComicseriesSupernatural = "COMICSERIES_SUPERNATURAL",
	ComicseriesThriller = "COMICSERIES_THRILLER",
	ComicseriesZombies = "COMICSERIES_ZOMBIES",
	PodcastseriesArts = "PODCASTSERIES_ARTS",
	PodcastseriesArtsBooks = "PODCASTSERIES_ARTS_BOOKS",
	PodcastseriesArtsDesign = "PODCASTSERIES_ARTS_DESIGN",
	PodcastseriesArtsFashionAndBeauty = "PODCASTSERIES_ARTS_FASHION_AND_BEAUTY",
	PodcastseriesArtsFood = "PODCASTSERIES_ARTS_FOOD",
	PodcastseriesArtsPerformingArts = "PODCASTSERIES_ARTS_PERFORMING_ARTS",
	PodcastseriesArtsVisualArts = "PODCASTSERIES_ARTS_VISUAL_ARTS",
	PodcastseriesBusiness = "PODCASTSERIES_BUSINESS",
	PodcastseriesBusinessCareers = "PODCASTSERIES_BUSINESS_CAREERS",
	PodcastseriesBusinessEntrepreneurship = "PODCASTSERIES_BUSINESS_ENTREPRENEURSHIP",
	PodcastseriesBusinessInvesting = "PODCASTSERIES_BUSINESS_INVESTING",
	PodcastseriesBusinessManagement = "PODCASTSERIES_BUSINESS_MANAGEMENT",
	PodcastseriesBusinessMarketing = "PODCASTSERIES_BUSINESS_MARKETING",
	PodcastseriesBusinessNonProfit = "PODCASTSERIES_BUSINESS_NON_PROFIT",
	PodcastseriesComedy = "PODCASTSERIES_COMEDY",
	PodcastseriesComedyImprov = "PODCASTSERIES_COMEDY_IMPROV",
	PodcastseriesComedyInterviews = "PODCASTSERIES_COMEDY_INTERVIEWS",
	PodcastseriesComedyStandup = "PODCASTSERIES_COMEDY_STANDUP",
	PodcastseriesEducation = "PODCASTSERIES_EDUCATION",
	PodcastseriesEducationCourses = "PODCASTSERIES_EDUCATION_COURSES",
	PodcastseriesEducationHowTo = "PODCASTSERIES_EDUCATION_HOW_TO",
	PodcastseriesEducationLanguageLearning = "PODCASTSERIES_EDUCATION_LANGUAGE_LEARNING",
	PodcastseriesEducationSelfImprovement = "PODCASTSERIES_EDUCATION_SELF_IMPROVEMENT",
	PodcastseriesFiction = "PODCASTSERIES_FICTION",
	PodcastseriesFictionComedyFiction = "PODCASTSERIES_FICTION_COMEDY_FICTION",
	PodcastseriesFictionDrama = "PODCASTSERIES_FICTION_DRAMA",
	PodcastseriesFictionScienceFiction = "PODCASTSERIES_FICTION_SCIENCE_FICTION",
	PodcastseriesGovernment = "PODCASTSERIES_GOVERNMENT",
	PodcastseriesHealthAndFitness = "PODCASTSERIES_HEALTH_AND_FITNESS",
	PodcastseriesHealthAndFitnessAlternativeHealth = "PODCASTSERIES_HEALTH_AND_FITNESS_ALTERNATIVE_HEALTH",
	PodcastseriesHealthAndFitnessFitness = "PODCASTSERIES_HEALTH_AND_FITNESS_FITNESS",
	PodcastseriesHealthAndFitnessMedicine = "PODCASTSERIES_HEALTH_AND_FITNESS_MEDICINE",
	PodcastseriesHealthAndFitnessMentalHealth = "PODCASTSERIES_HEALTH_AND_FITNESS_MENTAL_HEALTH",
	PodcastseriesHealthAndFitnessNutrition = "PODCASTSERIES_HEALTH_AND_FITNESS_NUTRITION",
	PodcastseriesHealthAndFitnessSexuality = "PODCASTSERIES_HEALTH_AND_FITNESS_SEXUALITY",
	PodcastseriesHistory = "PODCASTSERIES_HISTORY",
	PodcastseriesKidsAndFamily = "PODCASTSERIES_KIDS_AND_FAMILY",
	PodcastseriesKidsAndFamilyEducationForKids = "PODCASTSERIES_KIDS_AND_FAMILY_EDUCATION_FOR_KIDS",
	PodcastseriesKidsAndFamilyParenting = "PODCASTSERIES_KIDS_AND_FAMILY_PARENTING",
	PodcastseriesKidsAndFamilyPetsAndAnimals = "PODCASTSERIES_KIDS_AND_FAMILY_PETS_AND_ANIMALS",
	PodcastseriesKidsAndFamilyStoriesForKids = "PODCASTSERIES_KIDS_AND_FAMILY_STORIES_FOR_KIDS",
	PodcastseriesLeisure = "PODCASTSERIES_LEISURE",
	PodcastseriesLeisureAnimationAndManga = "PODCASTSERIES_LEISURE_ANIMATION_AND_MANGA",
	PodcastseriesLeisureAutomotive = "PODCASTSERIES_LEISURE_AUTOMOTIVE",
	PodcastseriesLeisureAviation = "PODCASTSERIES_LEISURE_AVIATION",
	PodcastseriesLeisureCrafts = "PODCASTSERIES_LEISURE_CRAFTS",
	PodcastseriesLeisureGames = "PODCASTSERIES_LEISURE_GAMES",
	PodcastseriesLeisureHobbies = "PODCASTSERIES_LEISURE_HOBBIES",
	PodcastseriesLeisureHomeAndGarden = "PODCASTSERIES_LEISURE_HOME_AND_GARDEN",
	PodcastseriesLeisureVideoGames = "PODCASTSERIES_LEISURE_VIDEO_GAMES",
	PodcastseriesMusic = "PODCASTSERIES_MUSIC",
	PodcastseriesMusicCommentary = "PODCASTSERIES_MUSIC_COMMENTARY",
	PodcastseriesMusicHistory = "PODCASTSERIES_MUSIC_HISTORY",
	PodcastseriesMusicInterviews = "PODCASTSERIES_MUSIC_INTERVIEWS",
	PodcastseriesNews = "PODCASTSERIES_NEWS",
	PodcastseriesNewsBusiness = "PODCASTSERIES_NEWS_BUSINESS",
	PodcastseriesNewsCommentary = "PODCASTSERIES_NEWS_COMMENTARY",
	PodcastseriesNewsDailyNews = "PODCASTSERIES_NEWS_DAILY_NEWS",
	PodcastseriesNewsEntertainment = "PODCASTSERIES_NEWS_ENTERTAINMENT",
	PodcastseriesNewsPolitics = "PODCASTSERIES_NEWS_POLITICS",
	PodcastseriesNewsSports = "PODCASTSERIES_NEWS_SPORTS",
	PodcastseriesNewsTech = "PODCASTSERIES_NEWS_TECH",
	PodcastseriesReligionAndSpirituality = "PODCASTSERIES_RELIGION_AND_SPIRITUALITY",
	PodcastseriesReligionAndSpiritualityBuddhism = "PODCASTSERIES_RELIGION_AND_SPIRITUALITY_BUDDHISM",
	PodcastseriesReligionAndSpiritualityChristianity = "PODCASTSERIES_RELIGION_AND_SPIRITUALITY_CHRISTIANITY",
	PodcastseriesReligionAndSpiritualityHinduism = "PODCASTSERIES_RELIGION_AND_SPIRITUALITY_HINDUISM",
	PodcastseriesReligionAndSpiritualityIslam = "PODCASTSERIES_RELIGION_AND_SPIRITUALITY_ISLAM",
	PodcastseriesReligionAndSpiritualityJudaism = "PODCASTSERIES_RELIGION_AND_SPIRITUALITY_JUDAISM",
	PodcastseriesReligionAndSpiritualityReligion = "PODCASTSERIES_RELIGION_AND_SPIRITUALITY_RELIGION",
	PodcastseriesReligionAndSpiritualitySpirituality = "PODCASTSERIES_RELIGION_AND_SPIRITUALITY_SPIRITUALITY",
	PodcastseriesScience = "PODCASTSERIES_SCIENCE",
	PodcastseriesScienceAstronomy = "PODCASTSERIES_SCIENCE_ASTRONOMY",
	PodcastseriesScienceChemistry = "PODCASTSERIES_SCIENCE_CHEMISTRY",
	PodcastseriesScienceEarthSciences = "PODCASTSERIES_SCIENCE_EARTH_SCIENCES",
	PodcastseriesScienceLifeSciences = "PODCASTSERIES_SCIENCE_LIFE_SCIENCES",
	PodcastseriesScienceMathematics = "PODCASTSERIES_SCIENCE_MATHEMATICS",
	PodcastseriesScienceNaturalSciences = "PODCASTSERIES_SCIENCE_NATURAL_SCIENCES",
	PodcastseriesScienceNature = "PODCASTSERIES_SCIENCE_NATURE",
	PodcastseriesSciencePhysics = "PODCASTSERIES_SCIENCE_PHYSICS",
	PodcastseriesScienceSocialSciences = "PODCASTSERIES_SCIENCE_SOCIAL_SCIENCES",
	PodcastseriesSocietyAndCulture = "PODCASTSERIES_SOCIETY_AND_CULTURE",
	PodcastseriesSocietyAndCultureDocumentary = "PODCASTSERIES_SOCIETY_AND_CULTURE_DOCUMENTARY",
	PodcastseriesSocietyAndCulturePersonalJournals = "PODCASTSERIES_SOCIETY_AND_CULTURE_PERSONAL_JOURNALS",
	PodcastseriesSocietyAndCulturePhilosophy = "PODCASTSERIES_SOCIETY_AND_CULTURE_PHILOSOPHY",
	PodcastseriesSocietyAndCulturePlacesAndTravel = "PODCASTSERIES_SOCIETY_AND_CULTURE_PLACES_AND_TRAVEL",
	PodcastseriesSocietyAndCultureRelationships = "PODCASTSERIES_SOCIETY_AND_CULTURE_RELATIONSHIPS",
	PodcastseriesSports = "PODCASTSERIES_SPORTS",
	PodcastseriesSportsBaseball = "PODCASTSERIES_SPORTS_BASEBALL",
	PodcastseriesSportsBasketball = "PODCASTSERIES_SPORTS_BASKETBALL",
	PodcastseriesSportsCricket = "PODCASTSERIES_SPORTS_CRICKET",
	PodcastseriesSportsFantasySports = "PODCASTSERIES_SPORTS_FANTASY_SPORTS",
	PodcastseriesSportsFootball = "PODCASTSERIES_SPORTS_FOOTBALL",
	PodcastseriesSportsGolf = "PODCASTSERIES_SPORTS_GOLF",
	PodcastseriesSportsHockey = "PODCASTSERIES_SPORTS_HOCKEY",
	PodcastseriesSportsRugby = "PODCASTSERIES_SPORTS_RUGBY",
	PodcastseriesSportsRunning = "PODCASTSERIES_SPORTS_RUNNING",
	PodcastseriesSportsSoccer = "PODCASTSERIES_SPORTS_SOCCER",
	PodcastseriesSportsSwimming = "PODCASTSERIES_SPORTS_SWIMMING",
	PodcastseriesSportsTennis = "PODCASTSERIES_SPORTS_TENNIS",
	PodcastseriesSportsVolleyball = "PODCASTSERIES_SPORTS_VOLLEYBALL",
	PodcastseriesSportsWilderness = "PODCASTSERIES_SPORTS_WILDERNESS",
	PodcastseriesSportsWrestling = "PODCASTSERIES_SPORTS_WRESTLING",
	PodcastseriesTechnology = "PODCASTSERIES_TECHNOLOGY",
	PodcastseriesTrueCrime = "PODCASTSERIES_TRUE_CRIME",
	PodcastseriesTvAndFilm = "PODCASTSERIES_TV_AND_FILM",
	PodcastseriesTvAndFilmAfterShows = "PODCASTSERIES_TV_AND_FILM_AFTER_SHOWS",
	PodcastseriesTvAndFilmFilmReviews = "PODCASTSERIES_TV_AND_FILM_FILM_REVIEWS",
	PodcastseriesTvAndFilmHistory = "PODCASTSERIES_TV_AND_FILM_HISTORY",
	PodcastseriesTvAndFilmInterviews = "PODCASTSERIES_TV_AND_FILM_INTERVIEWS",
	PodcastseriesTvAndFilmTvReviews = "PODCASTSERIES_TV_AND_FILM_TV_REVIEWS",
}

/**  HostingProvider Details  */
export type HostingProvider = {
	__typename?: "HostingProvider";
	/**  Date when the feed was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  A hash of all hosting provider details. It may be useful for you to save this property in your database and compare it to know if any details have updated since the last time you checked  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**  OAuth details for the hosting provider  */
	oauth?: Maybe<OAuthDetails>;
	/**  Stringified JSON details for the ouath details. Convert to JSON to use. */
	oauthAsString?: Maybe<Scalars["String"]["output"]>;
	/**  Name to use for contacting the owner of this feed  */
	sssOwnerName?: Maybe<Scalars["String"]["output"]>;
	/**  Email to use for contacting the owner of this feed  */
	sssOwnerPublicEmail?: Maybe<Scalars["String"]["output"]>;
	/**  Url for the creator's SSS feed  */
	sssUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Unique identifier for this hosting provider  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  Image Size / Variant  */
export enum ImageVariant {
	Large = "LARGE",
	Medium = "MEDIUM",
	Small = "SMALL",
}

/**  ComicIssue Details (for just the comics created on Taddy) */
export type InternalComicIssue = {
	__typename?: "InternalComicIssue";
	/**  The banner art for an issue  */
	bannerImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The reason for blocking the comic  */
	blockedReason?: Maybe<Scalars["String"]["output"]>;
	/**  Date when the comic is created (Epoch time in seconds) */
	createdAt?: Maybe<Scalars["Int"]["output"]>;
	/**  The date when exclusive content is available  */
	dateExclusiveContentIsAvailable?: Maybe<Scalars["Int"]["output"]>;
	/**  Date when the comic was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  The description (Creator Note) for an issue  */
	description?: Maybe<Scalars["String"]["output"]>;
	/**  Id of the internal comic issue */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  All the story art for an issue  */
	imageUrls?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  All the processing images for an issue  */
	imageUrlsProcessing?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  The processing status for images for the comic issue  */
	imagesStatus?: Maybe<InternalPublishImageStatus>;
	/**  If the comic has violated Taddy's distribution policies for illegal or harmful content  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**  The name (title) for an issue  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  Payment Rule Type for the comic issue  */
	paymentRuleType?: Maybe<InternalPaymentRuleType>;
	/**  Date when the comic is scheduled to be published (Epoch time in seconds)  */
	publishAt?: Maybe<Scalars["Int"]["output"]>;
	/**  The push notification text for an issue  */
	pushNotificationMessage?: Maybe<Scalars["String"]["output"]>;
	/**  The series that this issue belongs to  */
	series?: Maybe<InternalComicSeries>;
	/**  The series Uuid that this issue belongs to  */
	seriesUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  The publishing status for the comic issue  */
	status?: Maybe<InternalPublishStatus>;
	/**  The stories for an issue  */
	stories?: Maybe<Array<Maybe<InternalComicStory>>>;
	/**  The thumbnail art for an issue  */
	thumbnailImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Taddy's unique identifier (an uuid)  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  ComicSeries Details (for just the comics created on Taddy) */
export type InternalComicSeries = {
	__typename?: "InternalComicSeries";
	/**  The banner art for a comic  */
	bannerImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The reason for blocking the comic  */
	blockedReason?: Maybe<Scalars["String"]["output"]>;
	/**  Copyright details for the comic  */
	copyright?: Maybe<Scalars["String"]["output"]>;
	/**  Helpful counts for the comic  */
	counts?: Maybe<InternalSeriesCounts>;
	/**  The cover art for a comic  */
	coverImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The creators and roles of the comic  */
	creatorRoles?: Maybe<Array<Maybe<InternalCreatorRoles>>>;
	/**  Date when the comic was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  The description for a comic  */
	description?: Maybe<Scalars["String"]["output"]>;
	/**  A main genre for the comic  */
	genre1?: Maybe<Genre>;
	/**  The secondary genre for the comic  */
	genre2?: Maybe<Genre>;
	/**  The third genre for the comic  */
	genre3?: Maybe<Genre>;
	/**  Id of the internal comic series */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  The processing status for images for the comic series  */
	imagesStatus?: Maybe<InternalPublishImageStatus>;
	/**  If the comic has violated Taddy's distribution policies for illegal or harmful content  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**
	 *  If the comic is finished / complete
	 * @deprecated Use seriesStatus instead.
	 */
	isCompleted?: Maybe<Scalars["Boolean"]["output"]>;
	/**  A list of issues for this comic series  */
	issues?: Maybe<Array<Maybe<InternalComicIssue>>>;
	/**  Language spoken on the comic  */
	language?: Maybe<Language>;
	/**  The name (title) for a comic  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  Rating of the comic  */
	rating?: Maybe<ContentRating>;
	/**  Layout of the comic  */
	seriesLayout?: Maybe<ComicSeriesLayout>;
	/**  Status of the comic  */
	seriesStatus?: Maybe<SeriesStatus>;
	/**  Type of the comic  */
	seriesType?: Maybe<ComicSeriesType>;
	/**  Name to use for contacting the owner of the comic feed  */
	sssOwnerName?: Maybe<Scalars["String"]["output"]>;
	/**  Email to use for contacting the owner of the comic feed  */
	sssOwnerPublicEmail?: Maybe<Scalars["String"]["output"]>;
	/**  The publishing status for the comic  */
	status?: Maybe<InternalPublishStatus>;
	/**  Tags associated with the comic. Max of 12 tags  */
	tags?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  The thumbnail art for a comic  */
	thumbnailImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Taddy's unique identifier (an uuid)  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  ComicSeries Details (for just the comics created on Taddy) */
export type InternalComicSeriesDescriptionArgs = {
	shouldStripHtmlTags?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  ComicSeries Details (for just the comics created on Taddy) */
export type InternalComicSeriesIssuesArgs = {
	filterForStatus?: InputMaybe<InternalPublishStatus>;
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	sortOrder?: InputMaybe<SortOrder>;
};

/**  ComicStory Details (for just the comics created on Taddy) */
export type InternalComicStory = {
	__typename?: "InternalComicStory";
	/**  Id of the internal comic story */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  The art for the story  */
	imageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The position of the story in the issue  */
	position?: Maybe<Scalars["Int"]["output"]>;
	/**  Taddy's unique identifier (an uuid)  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  InternalCreator details  */
export type InternalCreator = {
	__typename?: "InternalCreator";
	/**  The creator's avatar  */
	avatarImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The creator's bio */
	bio?: Maybe<Scalars["String"]["output"]>;
	/**  Copyright details for the creator  */
	copyright?: Maybe<Scalars["String"]["output"]>;
	/**  Country where the creator resides or is based  */
	country?: Maybe<Country>;
	/**  Date when the internal creator feed was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  Id of the internal creator series */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  The processing status for images for the creator feed   */
	imagesStatus?: Maybe<InternalPublishImageStatus>;
	/**  If the creator has violated Taddy's distribution policies for illegal or harmful content  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**  Other social media links for the creator  */
	links?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  The creator's name  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  Name to use for contacting the owner of the creator feed  */
	sssOwnerName?: Maybe<Scalars["String"]["output"]>;
	/**  Email to use for contacting the owner of the creator feed  */
	sssOwnerPublicEmail?: Maybe<Scalars["String"]["output"]>;
	/**  The publishing status for the creator feed  */
	status?: Maybe<InternalPublishStatus>;
	/**  Tags associated with the creator. Max of 12 tags  */
	tags?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  Taddy's unique identifier (an uuid)  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  InternalCreator details  */
export type InternalCreatorBioArgs = {
	shouldStripHtmlTags?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  InternalCreator details  */
export type InternalCreatorRoles = {
	__typename?: "InternalCreatorRoles";
	/**  Taddy's unique identifier for the content (an uuid)  */
	contentUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Taddy's unique identifier for the creator (an uuid)  */
	creatorUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Id of the internal creator series */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  Is the internal creator approved  for the content  */
	isApproved?: Maybe<Scalars["Boolean"]["output"]>;
	/**  Roles associated with the internal creator. */
	roles?: Maybe<Array<Maybe<ContentRole>>>;
};

/**  InternalGroup Details  */
export type InternalGroup = {
	__typename?: "InternalGroup";
	/**  The content type  */
	contentType?: Maybe<Scalars["String"]["output"]>;
	/**  The content uuid  */
	contentUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Id of the group  */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  Are new episode added automatically to the group  */
	isCurrent?: Maybe<Scalars["Boolean"]["output"]>;
	/**  Content added to the group  */
	items?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  Name of the group  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  Uuid of the group  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  InternalGroupForContent Details  */
export type InternalGroupForContent = {
	__typename?: "InternalGroupForContent";
	/**  Taddy Type  */
	contentType: Scalars["String"]["output"];
	/**  Taddy's unique identifier for the content (an uuid)  */
	contentUuid: Scalars["ID"]["output"];
	/**  Content added to the group  */
	groups?: Maybe<Array<Maybe<InternalGroup>>>;
};

/**  InternalCreator details  */
export type InternalInvitation = {
	__typename?: "InternalInvitation";
	/**  Taddy's type for content  */
	contentType?: Maybe<Scalars["String"]["output"]>;
	/**  Taddy's unique identifier for the content (an uuid)  */
	contentUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Email addresses of the user invited  */
	email?: Maybe<Scalars["String"]["output"]>;
	/**  Id of the internal creator series */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  Permission  */
	permission?: Maybe<UserPermission>;
	/**  Status of the invitation  */
	status?: Maybe<InvitationStatus>;
};

export enum InternalPaymentRuleType {
	Free = "FREE",
	Paid = "PAID",
}

/**  Status of Image Optimization Step  */
export enum InternalPublishImageStatus {
	Complete = "COMPLETE",
	Processing = "PROCESSING",
}

/**  Status of Series  */
export enum InternalPublishStatus {
	Draft = "DRAFT",
	Published = "PUBLISHED",
	Scheduled = "SCHEDULED",
}

/**  Helpful counts for internal series  */
export type InternalSeriesCounts = {
	__typename?: "InternalSeriesCounts";
	contentType?: Maybe<Scalars["String"]["output"]>;
	contentUuid: Scalars["ID"]["output"];
	creators?: Maybe<Scalars["Int"]["output"]>;
	issues?: Maybe<Scalars["Int"]["output"]>;
};

/**  Types of internal series available on Taddy  */
export enum InternalSeriesType {
	InternalComicseries = "INTERNAL_COMICSERIES",
	InternalCreator = "INTERNAL_CREATOR",
}

export enum InvitationStatus {
	/**  Invitation has been accepted  */
	Accepted = "ACCEPTED",
	/**  Invitation has been expired  */
	Expired = "EXPIRED",
	/**  Invitation has been sent  */
	Pending = "PENDING",
}

/**  Languages (ISO 639-2 https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes)  */
export enum Language {
	Abkhazian = "ABKHAZIAN",
	Afar = "AFAR",
	Afrikaans = "AFRIKAANS",
	Akan = "AKAN",
	Albanian = "ALBANIAN",
	Amharic = "AMHARIC",
	Arabic = "ARABIC",
	Aragonese = "ARAGONESE",
	Armenian = "ARMENIAN",
	Assamese = "ASSAMESE",
	Avaric = "AVARIC",
	Avestan = "AVESTAN",
	Aymara = "AYMARA",
	Azerbaijani = "AZERBAIJANI",
	Bambara = "BAMBARA",
	Bashkir = "BASHKIR",
	Basque = "BASQUE",
	Belarusian = "BELARUSIAN",
	Bengali = "BENGALI",
	BihariLanguages = "BIHARI_LANGUAGES",
	Bislama = "BISLAMA",
	Bosnian = "BOSNIAN",
	Breton = "BRETON",
	Bulgarian = "BULGARIAN",
	Burmese = "BURMESE",
	CentralKhmer = "CENTRAL_KHMER",
	Chamorro = "CHAMORRO",
	Chechen = "CHECHEN",
	ChichewaChewaNyanja = "CHICHEWA_CHEWA_NYANJA",
	Chinese = "CHINESE",
	ChurchSlavonic = "CHURCH_SLAVONIC",
	Chuvash = "CHUVASH",
	Cornish = "CORNISH",
	Corsican = "CORSICAN",
	Cree = "CREE",
	Croatian = "CROATIAN",
	Czech = "CZECH",
	Danish = "DANISH",
	DhivehiMaldivian = "DHIVEHI_MALDIVIAN",
	DutchFlemish = "DUTCH_FLEMISH",
	Dzongkha = "DZONGKHA",
	English = "ENGLISH",
	Esperanto = "ESPERANTO",
	Estonian = "ESTONIAN",
	Ewe = "EWE",
	Faroese = "FAROESE",
	Farsi = "FARSI",
	Fijian = "FIJIAN",
	Finnish = "FINNISH",
	French = "FRENCH",
	Fulah = "FULAH",
	Gaelic = "GAELIC",
	Galician = "GALICIAN",
	Ganda = "GANDA",
	Georgian = "GEORGIAN",
	German = "GERMAN",
	Gikuyu = "GIKUYU",
	Greek = "GREEK",
	Guarani = "GUARANI",
	Gujarati = "GUJARATI",
	HaitianCreole = "HAITIAN_CREOLE",
	Hausa = "HAUSA",
	Hebrew = "HEBREW",
	Herero = "HERERO",
	Hindi = "HINDI",
	HiriMotu = "HIRI_MOTU",
	Hungarian = "HUNGARIAN",
	Icelandic = "ICELANDIC",
	Ido = "IDO",
	Igbo = "IGBO",
	Indonesian = "INDONESIAN",
	Interlingua = "INTERLINGUA",
	InterlingueOccidental = "INTERLINGUE_OCCIDENTAL",
	Inuktitut = "INUKTITUT",
	Inupiaq = "INUPIAQ",
	Irish = "IRISH",
	Italian = "ITALIAN",
	Japanese = "JAPANESE",
	Javanese = "JAVANESE",
	KalaallisutGreenlandic = "KALAALLISUT_GREENLANDIC",
	Kannada = "KANNADA",
	Kanuri = "KANURI",
	Kashmiri = "KASHMIRI",
	Kazakh = "KAZAKH",
	Kinyarwanda = "KINYARWANDA",
	Komi = "KOMI",
	Kongo = "KONGO",
	Korean = "KOREAN",
	Kurdish = "KURDISH",
	Kwanyama = "KWANYAMA",
	Kyrgyz = "KYRGYZ",
	Lao = "LAO",
	Latin = "LATIN",
	Latvian = "LATVIAN",
	Letzeburgesch = "LETZEBURGESCH",
	Limburgish = "LIMBURGISH",
	Lingala = "LINGALA",
	Lithuanian = "LITHUANIAN",
	LubaKatanga = "LUBA_KATANGA",
	Macedonian = "MACEDONIAN",
	Malagasy = "MALAGASY",
	Malay = "MALAY",
	Malayalam = "MALAYALAM",
	Maltese = "MALTESE",
	Manx = "MANX",
	Maori = "MAORI",
	Marathi = "MARATHI",
	Marshallese = "MARSHALLESE",
	Mongolian = "MONGOLIAN",
	Nauru = "NAURU",
	Navajo = "NAVAJO",
	Ndonga = "NDONGA",
	Nepali = "NEPALI",
	NorthernSami = "NORTHERN_SAMI",
	NorthNdebele = "NORTH_NDEBELE",
	Norwegian = "NORWEGIAN",
	NorwegianBokmal = "NORWEGIAN_BOKMAL",
	NorwegianNynorsk = "NORWEGIAN_NYNORSK",
	NuosuSichuanYi = "NUOSU_SICHUAN_YI",
	Occitan = "OCCITAN",
	Ojibwa = "OJIBWA",
	Oriya = "ORIYA",
	Oromo = "OROMO",
	Ossetian = "OSSETIAN",
	Pali = "PALI",
	Pashto = "PASHTO",
	Polish = "POLISH",
	Portuguese = "PORTUGUESE",
	Punjabi = "PUNJABI",
	Quechua = "QUECHUA",
	RomanianMoldovan = "ROMANIAN_MOLDOVAN",
	Romansh = "ROMANSH",
	Rundi = "RUNDI",
	Russian = "RUSSIAN",
	Samoan = "SAMOAN",
	Sango = "SANGO",
	Sanskrit = "SANSKRIT",
	Sardinian = "SARDINIAN",
	Serbian = "SERBIAN",
	Shona = "SHONA",
	Sindhi = "SINDHI",
	Sinhala = "SINHALA",
	Slovak = "SLOVAK",
	Slovenian = "SLOVENIAN",
	Somali = "SOMALI",
	Sotho = "SOTHO",
	SouthNdebele = "SOUTH_NDEBELE",
	Spanish = "SPANISH",
	Sundanese = "SUNDANESE",
	Swahili = "SWAHILI",
	Swati = "SWATI",
	Swedish = "SWEDISH",
	Tagalog = "TAGALOG",
	Tahitian = "TAHITIAN",
	Tajik = "TAJIK",
	Tamil = "TAMIL",
	Tatar = "TATAR",
	Telugu = "TELUGU",
	Thai = "THAI",
	Tibetan = "TIBETAN",
	Tigrinya = "TIGRINYA",
	Tonga = "TONGA",
	Tsonga = "TSONGA",
	Tswana = "TSWANA",
	Turkish = "TURKISH",
	Turkmen = "TURKMEN",
	Twi = "TWI",
	Ukrainian = "UKRAINIAN",
	Urdu = "URDU",
	Uyghur = "UYGHUR",
	Uzbek = "UZBEK",
	ValencianCatalan = "VALENCIAN_CATALAN",
	Venda = "VENDA",
	Vietnamese = "VIETNAMESE",
	Volapuk = "VOLAPUK",
	Walloon = "WALLOON",
	Welsh = "WELSH",
	WesternFrisian = "WESTERN_FRISIAN",
	Wolof = "WOLOF",
	Xhosa = "XHOSA",
	Yiddish = "YIDDISH",
	Yoruba = "YORUBA",
	Zhuang = "ZHUANG",
	Zulu = "ZULU",
}

/**  Link Details  */
export type LinkDetails = {
	__typename?: "LinkDetails";
	/**  The type of link  */
	type?: Maybe<LinkType>;
	/**  The url for the link  */
	url?: Maybe<Scalars["String"]["output"]>;
};

export enum LinkType {
	Bandcamp = "BANDCAMP",
	Discord = "DISCORD",
	Email = "EMAIL",
	Etsy = "ETSY",
	Facebook = "FACEBOOK",
	Instagram = "INSTAGRAM",
	KoFi = "KO_FI",
	Linktree = "LINKTREE",
	Mastodon = "MASTODON",
	MerchStore = "MERCH_STORE",
	Patreon = "PATREON",
	Pinterest = "PINTEREST",
	Reddit = "REDDIT",
	Snapchat = "SNAPCHAT",
	Soundcloud = "SOUNDCLOUD",
	Spotify = "SPOTIFY",
	Telegram = "TELEGRAM",
	Tiktok = "TIKTOK",
	Tumblr = "TUMBLR",
	Twitch = "TWITCH",
	Twitter = "TWITTER",
	Vimeo = "VIMEO",
	Website = "WEBSITE",
	Wechat = "WECHAT",
	Whatsapp = "WHATSAPP",
	Youtube = "YOUTUBE",
}

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type Mutation = {
	__typename?: "Mutation";
	addGroupForContent?: Maybe<InternalGroup>;
	addInternalComicForUser?: Maybe<InternalComicSeries>;
	addInternalComicIssueForUser?: Maybe<InternalComicIssue>;
	addInternalCreatorForUser?: Maybe<InternalCreator>;
	addInternalInvitationForContent?: Maybe<TeamInternalInvitations>;
	/**  Add a new Developer Application  */
	addNewDevApp?: Maybe<DevApp>;
	addOrUpdateInternalCreatorRolesForContent?: Maybe<TeamInternalCreatorRoles>;
	/**  Addd a payment rule  */
	addPaymentRuleForContent?: Maybe<PaymentRule>;
	addWebhookUrlForUser?: Maybe<Webhook>;
	/**  Add details on a webtoons series  */
	addWebtoonsSeriesData?: Maybe<Scalars["Boolean"]["output"]>;
	deleteGroupForContent?: Maybe<Scalars["ID"]["output"]>;
	deleteInternalComicForUser?: Maybe<Scalars["ID"]["output"]>;
	deleteInternalComicIssueForUser?: Maybe<Scalars["ID"]["output"]>;
	deleteInternalCreatorForUser?: Maybe<Scalars["ID"]["output"]>;
	/**  Delete a payment rule  */
	deletePaymentRuleForContent?: Maybe<Scalars["ID"]["output"]>;
	deleteWebhookForUser?: Maybe<Scalars["ID"]["output"]>;
	expireInternalInvitationForContent?: Maybe<TeamInternalInvitations>;
	generateWebhookEventsFromIds?: Maybe<Array<Maybe<WebhookEvent>>>;
	/**  Update a Developer Application  */
	updateDevClient?: Maybe<DevApp>;
	updateGroupForContent?: Maybe<InternalGroup>;
	updateInternalComicForUser?: Maybe<InternalComicSeries>;
	updateInternalComicIssueForUser?: Maybe<InternalComicIssue>;
	updateInternalCreatorForUser?: Maybe<InternalCreator>;
	/**  Update a payment rule  */
	updatePaymentRuleForContent?: Maybe<PaymentRule>;
	updateStatusForInternalComicSeries?: Maybe<InternalComicSeries>;
	updateStatusForInternalCreator?: Maybe<InternalCreator>;
	updateWebhookForUser?: Maybe<Webhook>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddGroupForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	isCurrent: Scalars["Boolean"]["input"];
	items: Array<InputMaybe<Scalars["String"]["input"]>>;
	name: Scalars["String"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddInternalComicForUserArgs = {
	bannerImageUrl: Scalars["String"]["input"];
	coverImageUrl: Scalars["String"]["input"];
	description: Scalars["String"]["input"];
	genre1: Genre;
	genre2?: InputMaybe<Genre>;
	genre3?: InputMaybe<Genre>;
	language: Language;
	name: Scalars["String"]["input"];
	rating: ContentRating;
	seriesLayout: ComicSeriesLayout;
	seriesStatus: SeriesStatus;
	seriesType: ComicSeriesType;
	tags?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
	thumbnailImageUrl: Scalars["String"]["input"];
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddInternalComicIssueForUserArgs = {
	bannerImageUrl?: InputMaybe<Scalars["String"]["input"]>;
	dateExclusiveContentIsAvailable?: InputMaybe<Scalars["String"]["input"]>;
	description?: InputMaybe<Scalars["String"]["input"]>;
	imageUrls: Array<InputMaybe<Scalars["String"]["input"]>>;
	name: Scalars["String"]["input"];
	publishAt?: InputMaybe<Scalars["String"]["input"]>;
	pushNotificationMessage?: InputMaybe<Scalars["String"]["input"]>;
	seriesUuid: Scalars["ID"]["input"];
	thumbnailImageUrl?: InputMaybe<Scalars["String"]["input"]>;
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddInternalCreatorForUserArgs = {
	avatarImageUrl: Scalars["String"]["input"];
	bio?: InputMaybe<Scalars["String"]["input"]>;
	country?: InputMaybe<Country>;
	links?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
	name: Scalars["String"]["input"];
	tags?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddInternalInvitationForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	email: Scalars["String"]["input"];
	permission: UserPermission;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddOrUpdateInternalCreatorRolesForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	creatorUuid: Scalars["ID"]["input"];
	roles: Array<InputMaybe<ContentRole>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddPaymentRuleForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	groupId?: InputMaybe<Scalars["ID"]["input"]>;
	platform: Platform;
	platformPriceId: Scalars["ID"]["input"];
	platformUserId: Scalars["String"]["input"];
	ruleType: PaymentRuleType;
	ruleValue?: InputMaybe<Scalars["Int"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddWebhookUrlForUserArgs = {
	endpointUrl: Scalars["String"]["input"];
	webhookEvents: Array<Scalars["String"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationAddWebtoonsSeriesDataArgs = {
	avatarImageUrl: Scalars["String"]["input"];
	bannerImageUrl: Scalars["String"]["input"];
	coverImageUrl: Scalars["String"]["input"];
	rating: ContentRating;
	thumbnailImageUrl: Scalars["String"]["input"];
	webtoonsLink: Scalars["String"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationDeleteGroupForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	id: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationDeleteInternalComicForUserArgs = {
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationDeleteInternalComicIssueForUserArgs = {
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationDeleteInternalCreatorForUserArgs = {
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationDeletePaymentRuleForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	id: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationDeleteWebhookForUserArgs = {
	id: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationExpireInternalInvitationForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	id: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationGenerateWebhookEventsFromIdsArgs = {
	ids?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdateDevClientArgs = {
	callbackUrl: Scalars["String"]["input"];
	description: Scalars["String"]["input"];
	id: Scalars["ID"]["input"];
	logoUrl: Scalars["String"]["input"];
	name: Scalars["String"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdateGroupForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	id: Scalars["ID"]["input"];
	isCurrent: Scalars["Boolean"]["input"];
	items: Array<InputMaybe<Scalars["String"]["input"]>>;
	name: Scalars["String"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdateInternalComicForUserArgs = {
	bannerImageUrl: Scalars["String"]["input"];
	coverImageUrl: Scalars["String"]["input"];
	description: Scalars["String"]["input"];
	genre1: Genre;
	genre2?: InputMaybe<Genre>;
	genre3?: InputMaybe<Genre>;
	language: Language;
	name: Scalars["String"]["input"];
	rating: ContentRating;
	seriesLayout: ComicSeriesLayout;
	seriesStatus: SeriesStatus;
	seriesType: ComicSeriesType;
	tags?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
	thumbnailImageUrl: Scalars["String"]["input"];
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdateInternalComicIssueForUserArgs = {
	bannerImageUrl?: InputMaybe<Scalars["String"]["input"]>;
	dateExclusiveContentIsAvailable?: InputMaybe<Scalars["String"]["input"]>;
	description?: InputMaybe<Scalars["String"]["input"]>;
	hasImagesCurrentlyProcessing?: InputMaybe<Scalars["Boolean"]["input"]>;
	imageUrls: Array<InputMaybe<Scalars["String"]["input"]>>;
	name: Scalars["String"]["input"];
	publishAt?: InputMaybe<Scalars["String"]["input"]>;
	pushNotificationMessage?: InputMaybe<Scalars["String"]["input"]>;
	thumbnailImageUrl?: InputMaybe<Scalars["String"]["input"]>;
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdateInternalCreatorForUserArgs = {
	avatarImageUrl: Scalars["String"]["input"];
	bio?: InputMaybe<Scalars["String"]["input"]>;
	country?: InputMaybe<Country>;
	links?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
	name: Scalars["String"]["input"];
	tags?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdatePaymentRuleForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
	groupId?: InputMaybe<Scalars["ID"]["input"]>;
	id: Scalars["ID"]["input"];
	platform?: InputMaybe<Platform>;
	platformPriceId: Scalars["ID"]["input"];
	platformUserId?: InputMaybe<Scalars["String"]["input"]>;
	ruleType: PaymentRuleType;
	ruleValue?: InputMaybe<Scalars["Int"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdateStatusForInternalComicSeriesArgs = {
	status: InternalPublishStatus;
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdateStatusForInternalCreatorArgs = {
	status: InternalPublishStatus;
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type MutationUpdateWebhookForUserArgs = {
	endpointUrl: Scalars["String"]["input"];
	id: Scalars["ID"]["input"];
	webhookEvents: Array<Scalars["String"]["input"]>;
};

/**  OAuth Details for a hosting provider  */
export type OAuthDetails = {
	__typename?: "OAuthDetails";
	authorizeUrl?: Maybe<Scalars["String"]["output"]>;
	instructionsUrl?: Maybe<Scalars["String"]["output"]>;
	newAccessTokenUrl?: Maybe<Scalars["String"]["output"]>;
	newContentTokenUrl?: Maybe<Scalars["String"]["output"]>;
	newRefreshTokenUrl?: Maybe<Scalars["String"]["output"]>;
	signupUrl?: Maybe<Scalars["String"]["output"]>;
	tokenUrl?: Maybe<Scalars["String"]["output"]>;
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

export type PaymentRule = {
	__typename?: "PaymentRule";
	/**  The type of the content  */
	contentType: Scalars["String"]["output"];
	/**  The uuid of the content  */
	contentUuid: Scalars["ID"]["output"];
	/**  The date the rule was created  */
	createdAt?: Maybe<Scalars["Int"]["output"]>;
	/**  The internal group details  */
	group?: Maybe<InternalGroup>;
	/**  The internal group id  */
	groupId?: Maybe<Scalars["ID"]["output"]>;
	id: Scalars["ID"]["output"];
	/**  The platform  */
	platform?: Maybe<Platform>;
	/**  The platform plan id  */
	platformPlanId?: Maybe<Scalars["ID"]["output"]>;
	/**  The platform price id  */
	platformPriceId?: Maybe<Scalars["ID"]["output"]>;
	/**  The platform user id  */
	platformUserId?: Maybe<Scalars["String"]["output"]>;
	/**  The rule type  */
	ruleType?: Maybe<PaymentRuleType>;
	/**  The rule value  */
	ruleValue?: Maybe<Scalars["Int"]["output"]>;
	/**  The status of the rule  */
	status?: Maybe<PaymentRuleStatus>;
	/**  The date the rule was last updated  */
	updatedAt?: Maybe<Scalars["Int"]["output"]>;
};

/**  PaymentRuleStatus  */
export enum PaymentRuleStatus {
	Active = "ACTIVE",
	Inactive = "INACTIVE",
	Processing = "PROCESSING",
}

/**  PaymentRuleType  */
export enum PaymentRuleType {
	Group = "GROUP",
	LastX = "LAST_X",
}

/**  PaymentRulesForContent  */
export type PaymentRulesForContent = {
	__typename?: "PaymentRulesForContent";
	contentType: Scalars["String"]["output"];
	contentUuid: Scalars["ID"]["output"];
	rules?: Maybe<Array<Maybe<PaymentRule>>>;
};

export type Person = {
	__typename?: "Person";
	/**  The url of the person's image  */
	imageUrl?: Maybe<Scalars["String"]["output"]>;
	/**
	 *  (Experimental) Whether the person has been extracted automatically from transcript
	 * @deprecated We no longer auto-generate persons from transcripts
	 */
	isAutoGenerated?: Maybe<Scalars["Boolean"]["output"]>;
	/**  The name of the person  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  The role of the person on the podcast  */
	role?: Maybe<ContentRole>;
	/**  The url for the person  */
	url?: Maybe<Scalars["String"]["output"]>;
	/**  Unique identifier (an uuid) for a person  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  Platform  */
export enum Platform {
	Patreon = "PATREON",
}

/**  PlatformDetails  */
export type PlatformDetails = {
	__typename?: "PlatformDetails";
	id: Scalars["ID"]["output"];
	/**  The name of the platform user  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  The platform  */
	platform?: Maybe<Platform>;
	/**  The platform user id  */
	platformUserId?: Maybe<Scalars["String"]["output"]>;
	/**  The url  */
	url?: Maybe<Scalars["String"]["output"]>;
};

/**  PlatformDetailsForContent  */
export type PlatformDetailsForContent = {
	__typename?: "PlatformDetailsForContent";
	contentType: Scalars["String"]["output"];
	contentUuid: Scalars["ID"]["output"];
	details?: Maybe<Array<Maybe<PlatformDetails>>>;
	plans?: Maybe<Array<Maybe<PlatformPlan>>>;
	prices?: Maybe<Array<Maybe<PlatformPrice>>>;
};

/**  PlatformPlan  */
export type PlatformPlan = {
	__typename?: "PlatformPlan";
	/**  The description of the plan  */
	description?: Maybe<Scalars["String"]["output"]>;
	id: Scalars["ID"]["output"];
	/**  The name of the plan  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  The platform of the plan  */
	platform?: Maybe<Platform>;
	/**  The platform user id  */
	platformUserId?: Maybe<Scalars["String"]["output"]>;
	/**  The prices of the plan  */
	prices?: Maybe<Array<Maybe<PlatformPrice>>>;
};

/**  PlatformPrice  */
export type PlatformPrice = {
	__typename?: "PlatformPrice";
	/**  The amount of the price  */
	amountInCents?: Maybe<Scalars["Int"]["output"]>;
	/**  The currency of the price  */
	currency?: Maybe<Scalars["String"]["output"]>;
	id: Scalars["ID"]["output"];
	/**  The interval of the price  */
	interval?: Maybe<PlatformPriceInterval>;
	/**  The name of the price  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  The platform plan id  */
	planId?: Maybe<Scalars["ID"]["output"]>;
	/**  The platform  */
	platform?: Maybe<Platform>;
	/**  The platform user id  */
	platformUserId?: Maybe<Scalars["String"]["output"]>;
	/**  The platform price id  */
	priceId?: Maybe<Scalars["ID"]["output"]>;
};

/**  PlatformPriceInterval  */
export enum PlatformPriceInterval {
	Monthly = "MONTHLY",
	PerItem = "PER_ITEM",
	Yearly = "YEARLY",
}

/**  Type of content  */
export enum PodcastContentType {
	Audio = "AUDIO",
	Video = "VIDEO",
}

/**  Podcast Episode Details  */
export type PodcastEpisode = {
	__typename?: "PodcastEpisode";
	/**  Link to Audio Content for the episode */
	audioUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Download and parse the chapters  */
	chapters?: Maybe<Array<Maybe<Chapter>>>;
	/**  A list of urls where you can download chapter details  */
	chaptersUrls?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  A list of urls where you can download chapter details, including more details  */
	chaptersUrlsWithDetails?: Maybe<Array<Maybe<ChapterLink>>>;
	/**  Date when the episode was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  The description for a episode  */
	description?: Maybe<Scalars["String"]["output"]>;
	/**  Extract all links from within the description.  */
	descriptionLinks?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  Duration of Content (in seconds)  */
	duration?: Maybe<Scalars["Int"]["output"]>;
	/**  Episode Number (if provided)  */
	episodeNumber?: Maybe<Scalars["Int"]["output"]>;
	/**  Episode Type ie) trailer, bonus or full  */
	episodeType?: Maybe<PodcastEpisodeType>;
	/**  File Length of Content  */
	fileLength?: Maybe<Scalars["Int"]["output"]>;
	/**  Exact File Type of Content  */
	fileType?: Maybe<Scalars["String"]["output"]>;
	/**  An episode's unique identifier from its RSS feed  */
	guid?: Maybe<Scalars["String"]["output"]>;
	/**  A different hash means that details for this episode have updated since the last hash  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  Cover Art for the episode (it may be different than podcast cover art)  */
	imageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**  If the episode contain's explicit content  */
	isExplicitContent?: Maybe<Scalars["Boolean"]["output"]>;
	/**  If the episode has now been removed from the RSS Feed  */
	isRemoved?: Maybe<Scalars["Boolean"]["output"]>;
	/**  The name of an episode  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  People listed on the episode including their roles (Host, Guest, etc)  */
	persons?: Maybe<Array<Maybe<Person>>>;
	/**  Details on the podcast for which this episode belongs to  */
	podcastSeries?: Maybe<PodcastSeries>;
	/**  Season Number (if provided)  */
	seasonNumber?: Maybe<Scalars["Int"]["output"]>;
	/**  The subtitle of an episode (shorter version of episode description, limited to 255 characters long)  */
	subtitle?: Maybe<Scalars["String"]["output"]>;
	/**  Status of automatically generated transcription  */
	taddyTranscribeStatus?: Maybe<PodcastEpisodeTranscriptionStatus>;
	/**  Downloads the transcript, parses it and returns an array of text in paragraphs.  */
	transcript?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  A list of urls where you can download the transcript for this episode  */
	transcriptUrls?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  A list of urls where you can download the transcript for this episode, including more details  */
	transcriptUrlsWithDetails?: Maybe<Array<Maybe<TranscriptLink>>>;
	/**  Download the transcript, parse it and return an array of transcript items (which include text, speakers and timecodes)  */
	transcriptWithSpeakersAndTimecodes?: Maybe<Array<Maybe<TranscriptItem>>>;
	/**  Taddy's unique identifier (an uuid)  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Link to Video Content for the episode */
	videoUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Website Link for episode  */
	websiteUrl?: Maybe<Scalars["String"]["output"]>;
};

/**  Podcast Episode Details  */
export type PodcastEpisodeDescriptionArgs = {
	shouldStripHtmlTags?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  Podcast Episode Details  */
export type PodcastEpisodeTranscriptArgs = {
	useOnDemandCreditsIfNeeded?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  Podcast Episode Details  */
export type PodcastEpisodeTranscriptWithSpeakersAndTimecodesArgs = {
	style?: InputMaybe<TranscriptItemStyle>;
	useOnDemandCreditsIfNeeded?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  Status of the episode's transcription  */
export enum PodcastEpisodeTranscriptionStatus {
	Completed = "COMPLETED",
	Failed = "FAILED",
	NotTranscribing = "NOT_TRANSCRIBING",
	Processing = "PROCESSING",
}

/**  Type of episodes (trailer, bonus, full)  */
export enum PodcastEpisodeType {
	Bonus = "BONUS",
	Full = "FULL",
	Trailer = "TRAILER",
}

/**  Podcast Details  */
export type PodcastSeries = {
	__typename?: "PodcastSeries";
	/**  Name of the Podcast creator (the podcast creator and the owner of the podcast feed can be different) */
	authorName?: Maybe<Scalars["String"]["output"]>;
	/**  A hash of all episode details. It may be useful for you to save this property in your database and compare it to know if there are any new or updated episodes since the last time you checked  */
	childrenHash?: Maybe<Scalars["String"]["output"]>;
	/**  Podcast's Content Type (Is the podcast primarily an Audio or Video Podcast)  */
	contentType?: Maybe<PodcastContentType>;
	/**  Copyright details for the podcast  */
	copyright?: Maybe<Scalars["String"]["output"]>;
	/**  Date when the podcast was published (Epoch time in seconds)  */
	datePublished?: Maybe<Scalars["Int"]["output"]>;
	/**  The description for a podcast  */
	description?: Maybe<Scalars["String"]["output"]>;
	/**  Extract all links from within the description.  */
	descriptionLinks?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  A list of episodes for this podcast  */
	episodes?: Maybe<Array<Maybe<PodcastEpisode>>>;
	/**  Details on how often the podcast is checked for new episodes  */
	feedRefreshDetails?: Maybe<FeedRefreshDetails>;
	/**  A podcast can belong to multiple genres but they are listed in order of importance. Limit of 5 genres per podcast */
	genres?: Maybe<Array<Maybe<Genre>>>;
	/**  A hash of all podcast details. It may be useful for you to save this property in your database and compare it to know if any podcast details have updated since the last time you checked  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  The cover art for a podcast  */
	imageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
	isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
	/**
	 *  (Old version) If the podcast is finished / complete
	 * @deprecated Use isCompleted instead
	 */
	isComplete?: Maybe<Scalars["Boolean"]["output"]>;
	/**  If the podcast is finished / complete  */
	isCompleted?: Maybe<Scalars["Boolean"]["output"]>;
	/**  Boolean for if the podcast contain's explicit content  */
	isExplicitContent?: Maybe<Scalars["Boolean"]["output"]>;
	/**  itunesId for the podcast  */
	itunesId?: Maybe<Scalars["Int"]["output"]>;
	/**  Additional info from itunes on the podcast  */
	itunesInfo?: Maybe<ITunesInfo>;
	/**  Language spoken on the podcast  */
	language?: Maybe<Language>;
	/**  The name (title) for a podcast  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  People listed on the podcast including their roles (Host, Guest, etc)  */
	persons?: Maybe<Array<Maybe<Person>>>;
	/**  Name to use for contacting the owner of this podcast feed  */
	rssOwnerName?: Maybe<Scalars["String"]["output"]>;
	/**  Email to use for contacting the owner of this podcast feed  */
	rssOwnerPublicEmail?: Maybe<Scalars["String"]["output"]>;
	/**  Url for the podcast's RSS feed  */
	rssUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Podcast type (serial or episodic)  */
	seriesType?: Maybe<PodcastSeriesType>;
	/**  Whether the podcast is being automatically transcribed by our API  */
	taddyTranscribeStatus?: Maybe<PodcastSeriesTranscriptionStatus>;
	/**  The number of episodes for this podcast  */
	totalEpisodesCount?: Maybe<Scalars["Int"]["output"]>;
	/**  Taddy's unique identifier (an uuid)  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
	/**  The podcast's website  */
	websiteUrl?: Maybe<Scalars["String"]["output"]>;
};

/**  Podcast Details  */
export type PodcastSeriesDescriptionArgs = {
	shouldStripHtmlTags?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  Podcast Details  */
export type PodcastSeriesEpisodesArgs = {
	includeRemovedEpisodes?: InputMaybe<Scalars["Boolean"]["input"]>;
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	searchTerm?: InputMaybe<Scalars["String"]["input"]>;
	sortOrder?: InputMaybe<SortOrder>;
};

/**  Podcast Details  */
export type PodcastSeriesTotalEpisodesCountArgs = {
	includeRemovedEpisodes?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  Status of the podcast's transcription  */
export enum PodcastSeriesTranscriptionStatus {
	CreatorAskedNotToTranscribe = "CREATOR_ASKED_NOT_TO_TRANSCRIBE",
	NotTranscribing = "NOT_TRANSCRIBING",
	Transcribing = "TRANSCRIBING",
}

/**  Type of podcast  */
export enum PodcastSeriesType {
	Episodic = "EPISODIC",
	Serial = "SERIAL",
}

/**  Developer Application Details  */
export type PublicClientDetails = {
	__typename?: "PublicClientDetails";
	/**  The application description */
	description?: Maybe<Scalars["String"]["output"]>;
	/**  The id for the app */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  The application logo */
	logoUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The application name */
	name?: Maybe<Scalars["String"]["output"]>;
};

/**  Details on internal content  */
export type PublicContentDetails = {
	__typename?: "PublicContentDetails";
	/**  Creators of the content  */
	creators?: Maybe<Array<Maybe<PublicCreatorDetails>>>;
	/**  Name of the content  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  The content type  */
	taddyType?: Maybe<Scalars["String"]["output"]>;
	/**  The content uuid  */
	uuid: Scalars["ID"]["output"];
};

/**  Details on all internal creator  */
export type PublicCreatorDetails = {
	__typename?: "PublicCreatorDetails";
	/**  The creator avatar image object  */
	avatarImageAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The creator avatar url  */
	avatarImageUrl?: Maybe<Scalars["String"]["output"]>;
	/**  The creator name  */
	name?: Maybe<Scalars["String"]["output"]>;
	/**  The creator uuid  */
	uuid: Scalars["ID"]["output"];
};

/**  Details on all internal creator  */
export type PublicCreatorDetailsAvatarImageUrlArgs = {
	variant?: InputMaybe<ImageVariant>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type Query = {
	__typename?: "Query";
	/**  Get details on a comic issue */
	getComicIssue?: Maybe<ComicIssue>;
	/**  Get details on a Comic  */
	getComicSeries?: Maybe<ComicSeries>;
	/**  Get details on a comic story */
	getComicStory?: Maybe<ComicStory>;
	/**  Get details on a Creator  */
	getCreator?: Maybe<Creator>;
	/**  Get details on a Creator  */
	getCreatorContent?: Maybe<CreatorContent>;
	/**  Get documentation  */
	getDocumenation?: Maybe<Documentation>;
	getEpisodeChapters?: Maybe<Array<Maybe<Chapter>>>;
	getEpisodeTranscript?: Maybe<Array<Maybe<TranscriptItem>>>;
	/**  Get details on all your internal series  */
	getGroupsForContent?: Maybe<InternalGroupForContent>;
	/**  Get details on a hosting provider  */
	getHostingProvider?: Maybe<HostingProvider>;
	/**  Get details on all your internal series  */
	getInternalComicForUser?: Maybe<InternalComicSeries>;
	/**  Get details on a internal comic issue  */
	getInternalComicIssue?: Maybe<InternalComicIssue>;
	/**  Get Internal Creator  */
	getInternalCreatorForUser?: Maybe<InternalCreator>;
	/**  Get details on all your internal series  */
	getInternalCreatorRolesForContent?: Maybe<TeamInternalCreatorRoles>;
	/**  Get Internal Creators  */
	getInternalCreatorsForContent?: Maybe<Array<Maybe<InternalCreator>>>;
	/**  Get Internal Creators  */
	getInternalCreatorsForUser?: Maybe<Array<Maybe<InternalCreator>>>;
	/**  Get details on all your internal series  */
	getInternalInvitationsForContent?: Maybe<TeamInternalInvitations>;
	/**  Get details on a Podcast  */
	getItunesInfo?: Maybe<ITunesInfo>;
	/**  Get details on multiple comic issues  */
	getMultipleComicIssues?: Maybe<Array<Maybe<ComicIssue>>>;
	/**  Get details on multiple comics  */
	getMultipleComicSeries?: Maybe<Array<Maybe<ComicSeries>>>;
	/**  Get details on multiple comic stories  */
	getMultipleComicStories?: Maybe<Array<Maybe<ComicStory>>>;
	/**  Get details on multiple creators  */
	getMultipleCreators?: Maybe<Array<Maybe<Creator>>>;
	/**  Get details on multiple podcast episodes */
	getMultiplePodcastEpisodes?: Maybe<Array<Maybe<PodcastEpisode>>>;
	/**  Get details on multiple podcasts  */
	getMultiplePodcastSeries?: Maybe<Array<Maybe<PodcastSeries>>>;
	/**  Get your Developer Applications  */
	getMyDeveloperApplications?: Maybe<UserDevApps>;
	/**  Get your Developer Applications  */
	getMyDeveloperWebhooks?: Maybe<UserWebhooks>;
	/**  Get details on all your internal series  */
	getMyInternalSeries?: Maybe<UserInternalSeriesList>;
	/**  Get payment rules for content  */
	getPaymentRulesForContent?: Maybe<PaymentRulesForContent>;
	/**  Get your Developer Applications  */
	getPermissionForItem?: Maybe<UserPermission>;
	/**  Get platform options connected for content  */
	getPlatformsForContent?: Maybe<PlatformDetailsForContent>;
	/**  Get details on a podcast episode */
	getPodcastEpisode?: Maybe<PodcastEpisode>;
	/**  Get details on a Podcast  */
	getPodcastSeries?: Maybe<PodcastSeries>;
	/**  Get details on a specifc internal series  */
	getPreviewDetailsForSeries?: Maybe<ContentInternalSeriesList>;
	/**  Get a public client details  */
	getPublicClientDetails?: Maybe<PublicClientDetails>;
	/**  Get details on all your internal series  */
	getPublicContentDetails?: Maybe<PublicContentDetails>;
	/**
	 *  Get Top Charts results details for a given source and taddy type
	 * @deprecated Use getTopChartsByCountry or getTopChartsByGenres instead
	 */
	getTopCharts?: Maybe<TopChartsResults>;
	/**  Get Top Charts By Country  */
	getTopChartsByCountry?: Maybe<TopChartsResults>;
	/**  Get Top Charts By Genre  */
	getTopChartsByGenres?: Maybe<TopChartsResults>;
	/**  Get details on a webtoons series  */
	getWebtoonsSeriesData?: Maybe<WebtoonSeriesData>;
	/**  Get your User Details */
	me?: Maybe<User>;
	/**  Get Search results details for a term  */
	search?: Maybe<SearchResults>;
	/**
	 *  Get Search results details for a term
	 * @deprecated use search query instead
	 */
	searchForTerm?: Maybe<SearchResults>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetComicIssueArgs = {
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetComicSeriesArgs = {
	name?: InputMaybe<Scalars["String"]["input"]>;
	sssUrl?: InputMaybe<Scalars["String"]["input"]>;
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetComicStoryArgs = {
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetCreatorArgs = {
	name?: InputMaybe<Scalars["String"]["input"]>;
	sssUrl?: InputMaybe<Scalars["String"]["input"]>;
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetCreatorContentArgs = {
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetDocumenationArgs = {
	id: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetEpisodeChaptersArgs = {
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetEpisodeTranscriptArgs = {
	style?: InputMaybe<TranscriptItemStyle>;
	useOnDemandCreditsIfNeeded?: InputMaybe<Scalars["Boolean"]["input"]>;
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetGroupsForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetHostingProviderArgs = {
	sssUrl?: InputMaybe<Scalars["String"]["input"]>;
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetInternalComicForUserArgs = {
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetInternalComicIssueArgs = {
	seriesUuid: Scalars["ID"]["input"];
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetInternalCreatorForUserArgs = {
	permissionType?: InputMaybe<Scalars["String"]["input"]>;
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetInternalCreatorRolesForContentArgs = {
	contentType?: InputMaybe<Scalars["String"]["input"]>;
	contentUuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetInternalCreatorsForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetInternalCreatorsForUserArgs = {
	permissionType?: InputMaybe<Scalars["String"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetInternalInvitationsForContentArgs = {
	contentType?: InputMaybe<Scalars["String"]["input"]>;
	contentUuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetItunesInfoArgs = {
	itunesId?: InputMaybe<Scalars["Int"]["input"]>;
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMultipleComicIssuesArgs = {
	uuids?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMultipleComicSeriesArgs = {
	uuids?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMultipleComicStoriesArgs = {
	uuids?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMultipleCreatorsArgs = {
	uuids?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMultiplePodcastEpisodesArgs = {
	uuids?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMultiplePodcastSeriesArgs = {
	uuids?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMyDeveloperApplicationsArgs = {
	limit?: InputMaybe<Scalars["Int"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMyDeveloperWebhooksArgs = {
	limit?: InputMaybe<Scalars["Int"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetMyInternalSeriesArgs = {
	filterForTypes?: InputMaybe<Array<InputMaybe<InternalSeriesType>>>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetPaymentRulesForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetPermissionForItemArgs = {
	taddyType: Scalars["String"]["input"];
	uuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetPlatformsForContentArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetPodcastEpisodeArgs = {
	guid?: InputMaybe<Scalars["String"]["input"]>;
	name?: InputMaybe<Scalars["String"]["input"]>;
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetPodcastSeriesArgs = {
	itunesId?: InputMaybe<Scalars["Int"]["input"]>;
	name?: InputMaybe<Scalars["String"]["input"]>;
	rssUrl?: InputMaybe<Scalars["String"]["input"]>;
	uuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetPreviewDetailsForSeriesArgs = {
	contentType: Scalars["String"]["input"];
	contentUuid: Scalars["ID"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetPublicClientDetailsArgs = {
	clientId: Scalars["String"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetPublicContentDetailsArgs = {
	seriesUuid?: InputMaybe<Scalars["ID"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetTopChartsArgs = {
	by: TopChartsType;
	country?: InputMaybe<Country>;
	genre?: InputMaybe<Genre>;
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	source?: InputMaybe<TopChartsSource>;
	taddyType: TaddyType;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetTopChartsByCountryArgs = {
	country: Country;
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	source?: InputMaybe<TopChartsSource>;
	taddyType: TaddyType;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetTopChartsByGenresArgs = {
	filterByCountry?: InputMaybe<Country>;
	genres?: InputMaybe<Array<Genre>>;
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	source?: InputMaybe<TopChartsSource>;
	taddyType: TaddyType;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QueryGetWebtoonsSeriesDataArgs = {
	url: Scalars["String"]["input"];
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QuerySearchArgs = {
	filterForComicSeriesLayout?: InputMaybe<Array<InputMaybe<ComicSeriesLayout>>>;
	filterForComicSeriesType?: InputMaybe<Array<InputMaybe<ComicSeriesType>>>;
	filterForContentRatings?: InputMaybe<Array<InputMaybe<ContentRating>>>;
	filterForContentRoles?: InputMaybe<Array<InputMaybe<ContentRole>>>;
	filterForCountries?: InputMaybe<Array<InputMaybe<Country>>>;
	filterForDurationGreaterThan?: InputMaybe<Scalars["Int"]["input"]>;
	filterForDurationLessThan?: InputMaybe<Scalars["Int"]["input"]>;
	filterForExclusiveContent?: InputMaybe<
		Array<InputMaybe<Scalars["String"]["input"]>>
	>;
	filterForGenres?: InputMaybe<Array<InputMaybe<Genre>>>;
	filterForHasTranscript?: InputMaybe<Scalars["Boolean"]["input"]>;
	filterForLanguages?: InputMaybe<Array<InputMaybe<Language>>>;
	filterForLastUpdatedAfter?: InputMaybe<Scalars["Int"]["input"]>;
	filterForLastUpdatedBefore?: InputMaybe<Scalars["Int"]["input"]>;
	filterForNotInSeriesUuids?: InputMaybe<
		Array<InputMaybe<Scalars["ID"]["input"]>>
	>;
	filterForPodcastContentType?: InputMaybe<
		Array<InputMaybe<PodcastContentType>>
	>;
	filterForPublishedAfter?: InputMaybe<Scalars["Int"]["input"]>;
	filterForPublishedBefore?: InputMaybe<Scalars["Int"]["input"]>;
	filterForSeriesUuids?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
	filterForTags?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
	filterForTotalEpisodesGreaterThan?: InputMaybe<Scalars["Int"]["input"]>;
	filterForTotalEpisodesLessThan?: InputMaybe<Scalars["Int"]["input"]>;
	filterForTotalIssuesGreaterThan?: InputMaybe<Scalars["Int"]["input"]>;
	filterForTotalIssuesLessThan?: InputMaybe<Scalars["Int"]["input"]>;
	filterForTypes?: InputMaybe<Array<InputMaybe<SearchContentType>>>;
	isSafeMode?: InputMaybe<Scalars["Boolean"]["input"]>;
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	matchBy?: InputMaybe<SearchMatchType>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	sortBy?: InputMaybe<SearchSortOrder>;
	term?: InputMaybe<Scalars["String"]["input"]>;
};

/**  Please go to https://taddy.org/developers for full documentation of the API  */
export type QuerySearchForTermArgs = {
	filterForContentRatings?: InputMaybe<Array<InputMaybe<ContentRating>>>;
	filterForContentRoles?: InputMaybe<Array<InputMaybe<ContentRole>>>;
	filterForCountries?: InputMaybe<Array<InputMaybe<Country>>>;
	filterForGenres?: InputMaybe<Array<InputMaybe<Genre>>>;
	filterForLanguages?: InputMaybe<Array<InputMaybe<Language>>>;
	filterForNotInSeriesUuids?: InputMaybe<
		Array<InputMaybe<Scalars["ID"]["input"]>>
	>;
	filterForPublishedAfter?: InputMaybe<Scalars["Int"]["input"]>;
	filterForPublishedBefore?: InputMaybe<Scalars["Int"]["input"]>;
	filterForSeriesUuids?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
	filterForTags?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
	filterForTypes?: InputMaybe<Array<InputMaybe<TaddyType>>>;
	includeSearchOperator?: InputMaybe<SearchOperator>;
	isSafeMode?: InputMaybe<Scalars["Boolean"]["input"]>;
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	searchResultsBoostType?: InputMaybe<SearchResultBoostType>;
	sortByDatePublished?: InputMaybe<SortOrder>;
	term?: InputMaybe<Scalars["String"]["input"]>;
};

/**  Types of media available on Taddy  */
export enum SearchContentType {
	Comicseries = "COMICSERIES",
	Creator = "CREATOR",
	Podcastepisode = "PODCASTEPISODE",
	Podcastseries = "PODCASTSERIES",
}

/**  Search Match types  */
export enum SearchMatchType {
	AllTerms = "ALL_TERMS",
	ExactPhrase = "EXACT_PHRASE",
	MostTerms = "MOST_TERMS",
}

export enum SearchOperator {
	And = "AND",
	ExactPhrase = "EXACT_PHRASE",
	Or = "OR",
}

export type SearchQueryResponseInfo = {
	__typename?: "SearchQueryResponseInfo";
	/**  Counts of each item type returned in the search results  */
	responseInfoDetails?: Maybe<Array<Maybe<SearchQueryResponseInfoDetails>>>;
	/**  Identifier for the search query being sent  */
	searchId: Scalars["ID"]["output"];
	/**  The number of milliseconds the uncached query took to search for results. If this query is already cached, this is immediately returned.  */
	took?: Maybe<Scalars["Int"]["output"]>;
};

export type SearchQueryResponseInfoDetails = {
	__typename?: "SearchQueryResponseInfoDetails";
	/**  Total number of pages of results returned for this type  */
	pagesCount?: Maybe<Scalars["Int"]["output"]>;
	/**  Identifier for the search query being sent  */
	searchId: Scalars["ID"]["output"];
	/**  Total number of search results returned for this type  */
	totalCount?: Maybe<Scalars["Int"]["output"]>;
	/**  The type of item being returned in the search results  */
	type?: Maybe<TaddyType>;
};

export type SearchRankingDetails = {
	__typename?: "SearchRankingDetails";
	/**  Identifier for the search query being sent  */
	id: Scalars["ID"]["output"];
	/**  The ranking score for the search results from 100 to 0. The higher the score the more relevant the result.  */
	rankingScore?: Maybe<Scalars["Int"]["output"]>;
	/**
	 *  The ranking score details as a JSON string
	 * @deprecated Not used anymore
	 */
	rankingScoreDetailsAsString?: Maybe<Scalars["String"]["output"]>;
	/**  The type of item being returned in the search results  */
	type?: Maybe<SearchContentType>;
	/**  The UUID of the item being returned in the search results  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

export type SearchResponseDetails = {
	__typename?: "SearchResponseDetails";
	/**  Identifier for the search query being sent  */
	id: Scalars["ID"]["output"];
	/**  Total number of pages of results returned for this type  */
	pagesCount?: Maybe<Scalars["Int"]["output"]>;
	/**  Total number of search results returned for this type  */
	totalCount?: Maybe<Scalars["Int"]["output"]>;
	/**  The type of item being returned in the search results  */
	type?: Maybe<SearchContentType>;
};

export enum SearchResultBoostType {
	BoostExactPhrase = "BOOST_EXACT_PHRASE",
	/** @deprecated Use BOOST_EXACT_PHRASE instead */
	BoostExactTerm = "BOOST_EXACT_TERM",
	BoostPopularityALittle = "BOOST_POPULARITY_A_LITTLE",
	BoostPopularityALot = "BOOST_POPULARITY_A_LOT",
}

/**  Search results  */
export type SearchResults = {
	__typename?: "SearchResults";
	/**
	 *  A list of ComicIssue items
	 * @deprecated Comic issues are no longer supported in search
	 */
	comicIssues?: Maybe<Array<Maybe<ComicIssue>>>;
	/**  A list of ComicSeries items  */
	comicSeries?: Maybe<Array<Maybe<ComicSeries>>>;
	/**  A list of Creator items  */
	creators?: Maybe<Array<Maybe<Creator>>>;
	/**  A list of PodcastEpisode items  */
	podcastEpisodes?: Maybe<Array<Maybe<PodcastEpisode>>>;
	/**  A list of PodcastSeries items  */
	podcastSeries?: Maybe<Array<Maybe<PodcastSeries>>>;
	/**
	 *  Additional information on the search results
	 * @deprecated use responseDetails instead
	 */
	queryResponseInfo?: Maybe<SearchQueryResponseInfo>;
	/**  Ranking information for each search result   */
	rankingDetails?: Maybe<Array<Maybe<SearchRankingDetails>>>;
	/**  Additional information on the search results (Total # of results, # of pages, etc)  */
	responseDetails?: Maybe<Array<Maybe<SearchResponseDetails>>>;
	/**  Identifier for the search query being sent  */
	searchId: Scalars["ID"]["output"];
};

/**  Search Sort orders  */
export enum SearchSortOrder {
	Exactness = "EXACTNESS",
	Popularity = "POPULARITY",
}

/**  Status of Series  */
export enum SeriesStatus {
	Announced = "ANNOUNCED",
	Cancelled = "CANCELLED",
	Completed = "COMPLETED",
	Hiatus = "HIATUS",
	Ongoing = "ONGOING",
	UnderRevision = "UNDER_REVISION",
}

/**  Different Sort orders  */
export enum SortOrder {
	Latest = "LATEST",
	Oldest = "OLDEST",
	Search = "SEARCH",
}

/**  Types of media available on Taddy  */
export enum TaddyType {
	Comicissue = "COMICISSUE",
	Comicseries = "COMICSERIES",
	Creator = "CREATOR",
	Podcastepisode = "PODCASTEPISODE",
	Podcastseries = "PODCASTSERIES",
}

/**  Details on roles for a piece of content  */
export type TeamInternalCreatorRoles = {
	__typename?: "TeamInternalCreatorRoles";
	/**  Taddy Type for content  */
	contentType?: Maybe<Scalars["String"]["output"]>;
	/**  Taddy's unique identifier for the content (an uuid)  */
	contentUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  List of internal creator roles  */
	creatorRoles?: Maybe<Array<Maybe<InternalCreatorRoles>>>;
	/**  List of creator  */
	internalCreators?: Maybe<Array<Maybe<InternalCreator>>>;
};

/**  TeamInternalInvitations details  */
export type TeamInternalInvitations = {
	__typename?: "TeamInternalInvitations";
	/**  Taddy's type for content  */
	contentType?: Maybe<Scalars["String"]["output"]>;
	/**  Taddy's unique identifier for the content (an uuid)  */
	contentUuid?: Maybe<Scalars["ID"]["output"]>;
	/**  Outstanding   */
	invitations?: Maybe<Array<Maybe<InternalInvitation>>>;
};

/**  Top Charts Results  */
export type TopChartsResults = {
	__typename?: "TopChartsResults";
	/**
	 *  If the Top charts is by genre or country (deprecated)
	 * @deprecated Not needed
	 */
	by?: Maybe<TopChartsType>;
	/**
	 *  The country the top charts are categorized by
	 * @deprecated Not needed
	 */
	country?: Maybe<Country>;
	/**
	 *  The genre the top charts are categorized by
	 * @deprecated Not needed
	 */
	genre?: Maybe<Genre>;
	/**  A list of PodcastEpisode items  */
	podcastEpisodes?: Maybe<Array<Maybe<PodcastEpisode>>>;
	/**  A list of PodcastSeries items  */
	podcastSeries?: Maybe<Array<Maybe<PodcastSeries>>>;
	/**
	 *  The platform to check for top charts content
	 * @deprecated Not needed
	 */
	source?: Maybe<TopChartsSource>;
	/**
	 *  The type of content
	 * @deprecated Not needed
	 */
	taddyType?: Maybe<TaddyType>;
	/**  Identifier for the top charts query being sent  */
	topChartsId: Scalars["ID"]["output"];
};

export enum TopChartsSource {
	ApplePodcasts = "APPLE_PODCASTS",
}

export enum TopChartsType {
	Country = "COUNTRY",
	Genre = "GENRE",
}

/**  Each line of the transcript  */
export type TranscriptItem = {
	__typename?: "TranscriptItem";
	/**  The end timecode of the transcript item in milliseconds  */
	endTimecode?: Maybe<Scalars["Int"]["output"]>;
	/**  The unique identifier for the transcript item  */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  The speaker of the transcript item  */
	speaker?: Maybe<Scalars["String"]["output"]>;
	/**  The start timecode of the transcript item in milliseconds  */
	startTimecode?: Maybe<Scalars["Int"]["output"]>;
	/**  The text of the transcript item  */
	text?: Maybe<Scalars["String"]["output"]>;
};

/**  Style of the transcript  */
export enum TranscriptItemStyle {
	Paragraph = "PARAGRAPH",
	Utterance = "UTTERANCE",
}

/**  A url link to the transcript for an episode  */
export type TranscriptLink = {
	__typename?: "TranscriptLink";
	/**  (Optional) If the transcript has timecodes  */
	hasTimecodes?: Maybe<Scalars["Boolean"]["output"]>;
	/**  If the transcript is exclusive to Taddy API Business users and you need an API key to access it  */
	isTaddyExclusive?: Maybe<Scalars["Boolean"]["output"]>;
	/**  (Optional) The language of the transcript  */
	language?: Maybe<Scalars["String"]["output"]>;
	/**  Mime type of file  */
	type?: Maybe<Scalars["String"]["output"]>;
	/**  The url to the transcript  */
	url?: Maybe<Scalars["String"]["output"]>;
};

/**  User Details  */
export type User = {
	__typename?: "User";
	/**  The user id */
	id?: Maybe<Scalars["ID"]["output"]>;
	myDeveloperBillingPlanDetails?: Maybe<UserDeveloperBillingPlanDetails>;
	myDeveloperDetails?: Maybe<UserDeveloperDetails>;
};

/**  User Details for Developer Application Details  */
export type UserDevApps = {
	__typename?: "UserDevApps";
	/**  A list of all the dev Apps for a user */
	devApps?: Maybe<Array<Maybe<DevApp>>>;
	/**  The user id for the dev app */
	userId?: Maybe<Scalars["ID"]["output"]>;
};

/**  Developer Billling Plan Details  */
export type UserDeveloperBillingPlanDetails = {
	__typename?: "UserDeveloperBillingPlanDetails";
	addons?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	cancelAt?: Maybe<Scalars["Float"]["output"]>;
	currentPeriodEnd?: Maybe<Scalars["Float"]["output"]>;
	endedAt?: Maybe<Scalars["Float"]["output"]>;
	primaryProduct?: Maybe<Scalars["String"]["output"]>;
	userId?: Maybe<Scalars["ID"]["output"]>;
};

/**  User Developer Details  */
export type UserDeveloperDetails = {
	__typename?: "UserDeveloperDetails";
	allowedApiCallsLimit?: Maybe<Scalars["Int"]["output"]>;
	allowedDevAppsLimit?: Maybe<Scalars["Int"]["output"]>;
	allowedOnDemandTranscriptsLimit?: Maybe<Scalars["Int"]["output"]>;
	allowedPopularEpisodeTranscriptsLimit?: Maybe<Scalars["Int"]["output"]>;
	allowedWebhookLimit?: Maybe<Scalars["Int"]["output"]>;
	currentApiUsage?: Maybe<Scalars["Int"]["output"]>;
	currentOnDemandTranscriptsUsage?: Maybe<Scalars["Int"]["output"]>;
	currentPopularEpisodeTranscriptsUsage?: Maybe<Scalars["Int"]["output"]>;
	isBusinessPlan?: Maybe<Scalars["Boolean"]["output"]>;
	userId?: Maybe<Scalars["ID"]["output"]>;
};

/**  Details on all internal series  */
export type UserInternalSeriesList = {
	__typename?: "UserInternalSeriesList";
	/**  List of internal comic series  */
	internalcomicseries?: Maybe<Array<Maybe<InternalComicSeries>>>;
	/**  List of creator feeds  */
	internalcreators?: Maybe<Array<Maybe<InternalCreator>>>;
	/**  The user id */
	userId?: Maybe<Scalars["ID"]["output"]>;
};

/**  Permission on Taddy  */
export enum UserPermission {
	Admin = "ADMIN",
	Contributor = "CONTRIBUTOR",
	Owner = "OWNER",
	Viewer = "VIEWER",
}

/**  User Details for Developer Application Details  */
export type UserWebhooks = {
	__typename?: "UserWebhooks";
	/**  The user id for the dev app */
	userId?: Maybe<Scalars["ID"]["output"]>;
	/**  A list of all the dev Apps for a user */
	webhooks?: Maybe<Array<Maybe<Webhook>>>;
};

/**  Webhook Details  */
export type Webhook = {
	__typename?: "Webhook";
	/**  Date created (Epoch time in seconds)  */
	createdAt?: Maybe<Scalars["Int"]["output"]>;
	/**  URL for the webhook  */
	endpointUrl?: Maybe<Scalars["String"]["output"]>;
	/** Events that get triggered for the webhook */
	events?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
	/**  The unique identifier for the webhook  */
	id: Scalars["ID"]["output"];
	/** If the webhook is active or not */
	isActive?: Maybe<Scalars["Boolean"]["output"]>;
	/** If the webhook is verified or not */
	isVerified?: Maybe<Scalars["Boolean"]["output"]>;
	/**  User that created the webhook  */
	user?: Maybe<User>;
	/**  Secret for the webhook  */
	webhookSecret?: Maybe<Scalars["String"]["output"]>;
};

/**  WebhookEvent Details  */
export type WebhookEvent = {
	__typename?: "WebhookEvent";
	action?: Maybe<WebhookEventActionType>;
	itunesInfo?: Maybe<ITunesInfo>;
	podcastEpisode?: Maybe<PodcastEpisode>;
	podcastSeries?: Maybe<PodcastSeries>;
	taddyType?: Maybe<Scalars["String"]["output"]>;
	timestamp?: Maybe<Scalars["Float"]["output"]>;
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  Type of webhook action  */
export enum WebhookEventActionType {
	Created = "created",
	Deleted = "deleted",
	NewEpisodesReleased = "new_episodes_released",
	Updated = "updated",
}

/**  Websub Details  */
export type WebsubDetails = {
	__typename?: "WebsubDetails";
	/**  If the websub notification is currently active  */
	isVerified?: Maybe<Scalars["Boolean"]["output"]>;
	/**  The feed url for the websub  */
	topicUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Taddy's unique identifier  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
	/**  The url for the hub where you get the websub notification  */
	websubHubUrl?: Maybe<Scalars["String"]["output"]>;
};

/**  Details Webtoons on a webtoons comic so that they can be imported into Taddy  */
export type WebtoonSeriesData = {
	__typename?: "WebtoonSeriesData";
	/**  The description for a comic  */
	description?: Maybe<Scalars["String"]["output"]>;
	/**  A main genre for the comic  */
	genre1?: Maybe<Genre>;
	/**  The secondary genre for the comic  */
	genre2?: Maybe<Genre>;
	/**  Id */
	id?: Maybe<Scalars["ID"]["output"]>;
	/**  Language spoken on the comic  */
	language?: Maybe<Language>;
	/**  The name (title) for a comic  */
	name?: Maybe<Scalars["String"]["output"]>;
};

/**  iTunes Info for a podcast  */
export type ITunesInfo = {
	__typename?: "iTunesInfo";
	/**  Base Url to the podcast's cover art from iTunes. NOTE: To get a working image, you need to pass in a size at the end of the url in the format {baseArtworkUrl}{size}x{size}bb.png ex {baseArtworkUrl}640x640bb.png  */
	baseArtworkUrl?: Maybe<Scalars["String"]["output"]>;
	/**  Helper Url to the podcast's cover art from iTunes. Pass in an interger for the size of the image you want  */
	baseArtworkUrlOf?: Maybe<Scalars["String"]["output"]>;
	/**  Country where the podcast is made  */
	country?: Maybe<Country>;
	/**  A different hash signals that itunes information has changed since the last hash  */
	hash?: Maybe<Scalars["String"]["output"]>;
	/**  PodcastSeries linked to this iTunesInfo  */
	podcastSeries?: Maybe<PodcastSeries>;
	/**  Publisher Id from iTunes  */
	publisherId?: Maybe<Scalars["Int"]["output"]>;
	/**  Publisher name from iTunes  */
	publisherName?: Maybe<Scalars["String"]["output"]>;
	/**  Subtitle given in Apple Podcasts  */
	subtitle?: Maybe<Scalars["String"]["output"]>;
	/**  Summary given in Apple Podcasts  */
	summary?: Maybe<Scalars["String"]["output"]>;
	/**  PodcastSeries unique identifier linked to this iTunesInfo  */
	uuid?: Maybe<Scalars["ID"]["output"]>;
};

/**  iTunes Info for a podcast  */
export type ITunesInfoBaseArtworkUrlOfArgs = {
	size?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GetPodcastEpisodeQueryVariables = Exact<{
	uuid: Scalars["ID"]["input"];
}>;

export type GetPodcastEpisodeQuery = {
	__typename?: "Query";
	getPodcastEpisode?: {
		__typename?: "PodcastEpisode";
		uuid?: string | null;
		hash?: string | null;
		name?: string | null;
		description?: string | null;
		imageUrl?: string | null;
		datePublished?: number | null;
		guid?: string | null;
		subtitle?: string | null;
		audioUrl?: string | null;
		videoUrl?: string | null;
		fileLength?: number | null;
		fileType?: string | null;
		duration?: number | null;
		episodeType?: PodcastEpisodeType | null;
		seasonNumber?: number | null;
		episodeNumber?: number | null;
		websiteUrl?: string | null;
		isExplicitContent?: boolean | null;
		isRemoved?: boolean | null;
		podcastSeries?: {
			__typename?: "PodcastSeries";
			uuid?: string | null;
			name?: string | null;
		} | null;
	} | null;
};

export type GetMultiplePodcastSeriesQueryVariables = Exact<{
	uuids: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
}>;

export type GetMultiplePodcastSeriesQuery = {
	__typename?: "Query";
	getMultiplePodcastSeries?: Array<{
		__typename?: "PodcastSeries";
		uuid?: string | null;
		datePublished?: number | null;
		name?: string | null;
		description?: string | null;
		descriptionLinks?: Array<string | null> | null;
		imageUrl?: string | null;
		itunesId?: number | null;
		hash?: string | null;
		childrenHash?: string | null;
		totalEpisodesCount?: number | null;
		genres?: Array<Genre | null> | null;
		seriesType?: PodcastSeriesType | null;
		language?: Language | null;
		contentType?: PodcastContentType | null;
		isExplicitContent?: boolean | null;
		copyright?: string | null;
		websiteUrl?: string | null;
		rssUrl?: string | null;
		rssOwnerName?: string | null;
		rssOwnerPublicEmail?: string | null;
		authorName?: string | null;
	} | null> | null;
};

export type GetPodcastsByGenreQueryVariables = Exact<{
	taddyType: TaddyType;
	genres?: InputMaybe<Array<Genre> | Genre>;
}>;

export type GetPodcastsByGenreQuery = {
	__typename?: "Query";
	getTopChartsByGenres?: {
		__typename?: "TopChartsResults";
		topChartsId: string;
		podcastSeries?: Array<{
			__typename?: "PodcastSeries";
			uuid?: string | null;
			datePublished?: number | null;
			name?: string | null;
			description?: string | null;
			descriptionLinks?: Array<string | null> | null;
			imageUrl?: string | null;
			itunesId?: number | null;
			hash?: string | null;
			childrenHash?: string | null;
			totalEpisodesCount?: number | null;
			genres?: Array<Genre | null> | null;
			seriesType?: PodcastSeriesType | null;
			language?: Language | null;
			contentType?: PodcastContentType | null;
			isExplicitContent?: boolean | null;
			copyright?: string | null;
			websiteUrl?: string | null;
			rssUrl?: string | null;
			rssOwnerName?: string | null;
			rssOwnerPublicEmail?: string | null;
			authorName?: string | null;
		} | null> | null;
	} | null;
};

export type GetPodcastSeriesQueryVariables = Exact<{
	uuid: Scalars["ID"]["input"];
}>;

export type GetPodcastSeriesQuery = {
	__typename?: "Query";
	getPodcastSeries?: {
		__typename?: "PodcastSeries";
		uuid?: string | null;
		datePublished?: number | null;
		name?: string | null;
		description?: string | null;
		descriptionLinks?: Array<string | null> | null;
		imageUrl?: string | null;
		itunesId?: number | null;
		hash?: string | null;
		childrenHash?: string | null;
		totalEpisodesCount?: number | null;
		genres?: Array<Genre | null> | null;
		seriesType?: PodcastSeriesType | null;
		language?: Language | null;
		contentType?: PodcastContentType | null;
		isExplicitContent?: boolean | null;
		copyright?: string | null;
		websiteUrl?: string | null;
		rssUrl?: string | null;
		rssOwnerName?: string | null;
		rssOwnerPublicEmail?: string | null;
		authorName?: string | null;
		episodes?: Array<{
			__typename?: "PodcastEpisode";
			uuid?: string | null;
			name?: string | null;
			description?: string | null;
			audioUrl?: string | null;
			imageUrl?: string | null;
			duration?: number | null;
			datePublished?: number | null;
			isExplicitContent?: boolean | null;
		} | null> | null;
	} | null;
};

export type GetTopChartsByCountryQueryVariables = Exact<{
	taddyType: TaddyType;
	country: Country;
}>;

export type GetTopChartsByCountryQuery = {
	__typename?: "Query";
	getTopChartsByCountry?: {
		__typename?: "TopChartsResults";
		topChartsId: string;
		podcastSeries?: Array<{
			__typename?: "PodcastSeries";
			uuid?: string | null;
			datePublished?: number | null;
			name?: string | null;
			description?: string | null;
			descriptionLinks?: Array<string | null> | null;
			imageUrl?: string | null;
			itunesId?: number | null;
			hash?: string | null;
			childrenHash?: string | null;
			totalEpisodesCount?: number | null;
			genres?: Array<Genre | null> | null;
			seriesType?: PodcastSeriesType | null;
			language?: Language | null;
			contentType?: PodcastContentType | null;
			isExplicitContent?: boolean | null;
			copyright?: string | null;
			websiteUrl?: string | null;
			rssUrl?: string | null;
			rssOwnerName?: string | null;
			rssOwnerPublicEmail?: string | null;
			authorName?: string | null;
		} | null> | null;
	} | null;
};

export type SearchPodcastQueryVariables = Exact<{
	term: Scalars["String"]["input"];
	limitPerPage?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type SearchPodcastQuery = {
	__typename?: "Query";
	search?: {
		__typename?: "SearchResults";
		searchId: string;
		podcastSeries?: Array<{
			__typename?: "PodcastSeries";
			uuid?: string | null;
			datePublished?: number | null;
			name?: string | null;
			description?: string | null;
			descriptionLinks?: Array<string | null> | null;
			imageUrl?: string | null;
			itunesId?: number | null;
			hash?: string | null;
			childrenHash?: string | null;
			totalEpisodesCount?: number | null;
			genres?: Array<Genre | null> | null;
			seriesType?: PodcastSeriesType | null;
			language?: Language | null;
			contentType?: PodcastContentType | null;
			isExplicitContent?: boolean | null;
			copyright?: string | null;
			websiteUrl?: string | null;
			rssUrl?: string | null;
			rssOwnerName?: string | null;
			rssOwnerPublicEmail?: string | null;
			authorName?: string | null;
		} | null> | null;
	} | null;
};

export const GetPodcastEpisodeDocument = gql`
    query GetPodcastEpisode($uuid: ID!) {
  getPodcastEpisode(uuid: $uuid) {
    uuid
    hash
    name
    description
    imageUrl
    datePublished
    guid
    subtitle
    audioUrl
    videoUrl
    fileLength
    fileType
    duration
    episodeType
    seasonNumber
    episodeNumber
    websiteUrl
    isExplicitContent
    isRemoved
    podcastSeries {
      uuid
      name
    }
  }
}
    `;
export const GetMultiplePodcastSeriesDocument = gql`
    query GetMultiplePodcastSeries($uuids: [ID!]!) {
  getMultiplePodcastSeries(uuids: $uuids) {
    uuid
    datePublished
    name
    description
    descriptionLinks
    imageUrl
    itunesId
    hash
    childrenHash
    totalEpisodesCount
    genres
    seriesType
    language
    contentType
    isExplicitContent
    copyright
    websiteUrl
    rssUrl
    rssOwnerName
    rssOwnerPublicEmail
    authorName
  }
}
    `;
export const GetPodcastsByGenreDocument = gql`
    query GetPodcastsByGenre($taddyType: TaddyType!, $genres: [Genre!]) {
  getTopChartsByGenres(taddyType: $taddyType, genres: $genres) {
    topChartsId
    podcastSeries {
      uuid
      datePublished
      name
      description
      descriptionLinks
      imageUrl
      itunesId
      hash
      childrenHash
      totalEpisodesCount
      genres
      seriesType
      language
      contentType
      isExplicitContent
      copyright
      websiteUrl
      rssUrl
      rssOwnerName
      rssOwnerPublicEmail
      authorName
    }
  }
}
    `;
export const GetPodcastSeriesDocument = gql`
    query GetPodcastSeries($uuid: ID!) {
  getPodcastSeries(uuid: $uuid) {
    uuid
    datePublished
    name
    description
    descriptionLinks
    imageUrl
    itunesId
    hash
    childrenHash
    totalEpisodesCount
    genres
    seriesType
    language
    contentType
    isExplicitContent
    copyright
    websiteUrl
    rssUrl
    rssOwnerName
    rssOwnerPublicEmail
    authorName
    episodes {
      uuid
      name
      description
      audioUrl
      imageUrl
      duration
      datePublished
      isExplicitContent
    }
  }
}
    `;
export const GetTopChartsByCountryDocument = gql`
    query GetTopChartsByCountry($taddyType: TaddyType!, $country: Country!) {
  getTopChartsByCountry(taddyType: $taddyType, country: $country) {
    topChartsId
    podcastSeries {
      uuid
      datePublished
      name
      description
      descriptionLinks
      imageUrl
      itunesId
      hash
      childrenHash
      totalEpisodesCount
      genres
      seriesType
      language
      contentType
      isExplicitContent
      copyright
      websiteUrl
      rssUrl
      rssOwnerName
      rssOwnerPublicEmail
      authorName
    }
  }
}
    `;
export const SearchPodcastDocument = gql`
    query SearchPodcast($term: String!, $limitPerPage: Int) {
  search(term: $term, filterForTypes: PODCASTSERIES, limitPerPage: $limitPerPage) {
    searchId
    podcastSeries {
      uuid
      datePublished
      name
      description
      descriptionLinks
      imageUrl
      itunesId
      hash
      childrenHash
      totalEpisodesCount
      genres
      seriesType
      language
      contentType
      isExplicitContent
      copyright
      websiteUrl
      rssUrl
      rssOwnerName
      rssOwnerPublicEmail
      authorName
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(
	action: (requestHeaders?: Record<string, string>) => Promise<T>,
	operationName: string,
	operationType?: string,
	variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
	action,
	_operationName,
	_operationType,
	_variables,
) => action();

export function getSdk(
	client: GraphQLClient,
	withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
	return {
		GetPodcastEpisode(
			variables: GetPodcastEpisodeQueryVariables,
			requestHeaders?: GraphQLClientRequestHeaders,
		): Promise<GetPodcastEpisodeQuery> {
			return withWrapper(
				(wrappedRequestHeaders) =>
					client.request<GetPodcastEpisodeQuery>(
						GetPodcastEpisodeDocument,
						variables,
						{ ...requestHeaders, ...wrappedRequestHeaders },
					),
				"GetPodcastEpisode",
				"query",
				variables,
			);
		},
		GetMultiplePodcastSeries(
			variables: GetMultiplePodcastSeriesQueryVariables,
			requestHeaders?: GraphQLClientRequestHeaders,
		): Promise<GetMultiplePodcastSeriesQuery> {
			return withWrapper(
				(wrappedRequestHeaders) =>
					client.request<GetMultiplePodcastSeriesQuery>(
						GetMultiplePodcastSeriesDocument,
						variables,
						{ ...requestHeaders, ...wrappedRequestHeaders },
					),
				"GetMultiplePodcastSeries",
				"query",
				variables,
			);
		},
		GetPodcastsByGenre(
			variables: GetPodcastsByGenreQueryVariables,
			requestHeaders?: GraphQLClientRequestHeaders,
		): Promise<GetPodcastsByGenreQuery> {
			return withWrapper(
				(wrappedRequestHeaders) =>
					client.request<GetPodcastsByGenreQuery>(
						GetPodcastsByGenreDocument,
						variables,
						{ ...requestHeaders, ...wrappedRequestHeaders },
					),
				"GetPodcastsByGenre",
				"query",
				variables,
			);
		},
		GetPodcastSeries(
			variables: GetPodcastSeriesQueryVariables,
			requestHeaders?: GraphQLClientRequestHeaders,
		): Promise<GetPodcastSeriesQuery> {
			return withWrapper(
				(wrappedRequestHeaders) =>
					client.request<GetPodcastSeriesQuery>(
						GetPodcastSeriesDocument,
						variables,
						{ ...requestHeaders, ...wrappedRequestHeaders },
					),
				"GetPodcastSeries",
				"query",
				variables,
			);
		},
		GetTopChartsByCountry(
			variables: GetTopChartsByCountryQueryVariables,
			requestHeaders?: GraphQLClientRequestHeaders,
		): Promise<GetTopChartsByCountryQuery> {
			return withWrapper(
				(wrappedRequestHeaders) =>
					client.request<GetTopChartsByCountryQuery>(
						GetTopChartsByCountryDocument,
						variables,
						{ ...requestHeaders, ...wrappedRequestHeaders },
					),
				"GetTopChartsByCountry",
				"query",
				variables,
			);
		},
		SearchPodcast(
			variables: SearchPodcastQueryVariables,
			requestHeaders?: GraphQLClientRequestHeaders,
		): Promise<SearchPodcastQuery> {
			return withWrapper(
				(wrappedRequestHeaders) =>
					client.request<SearchPodcastQuery>(SearchPodcastDocument, variables, {
						...requestHeaders,
						...wrappedRequestHeaders,
					}),
				"SearchPodcast",
				"query",
				variables,
			);
		},
	};
}
export type Sdk = ReturnType<typeof getSdk>;
