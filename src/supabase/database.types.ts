export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			chapters: {
				Row: {
					created_at: string | null;
					end_time: number;
					episode_uuid: string;
					id: number;
					start_time: number;
					title: string;
				};
				Insert: {
					created_at?: string | null;
					end_time: number;
					episode_uuid: string;
					id?: number;
					start_time: number;
					title: string;
				};
				Update: {
					created_at?: string | null;
					end_time?: number;
					episode_uuid?: string;
					id?: number;
					start_time?: number;
					title?: string;
				};
				Relationships: [];
			};
			favorites: {
				Row: {
					episode_uuid: string;
					favorited_at: string | null;
					id: number;
					user_id: string;
				};
				Insert: {
					episode_uuid: string;
					favorited_at?: string | null;
					id?: number;
					user_id: string;
				};
				Update: {
					episode_uuid?: string;
					favorited_at?: string | null;
					id?: number;
					user_id?: string;
				};
				Relationships: [];
			};
			listening_history: {
				Row: {
					completed_at: string | null;
					created_at: string | null;
					duration: number;
					episode_uuid: string;
					id: number;
					progress: number;
					started_at: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string | null;
					duration: number;
					episode_uuid: string;
					id?: number;
					progress: number;
					started_at?: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string | null;
					duration?: number;
					episode_uuid?: string;
					id?: number;
					progress?: number;
					started_at?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			people: {
				Row: {
					created_at: string | null;
					id: number;
					image_url: string | null;
					name: string;
					role: string | null;
					url: string | null;
					uuid: string;
				};
				Insert: {
					created_at?: string | null;
					id?: number;
					image_url?: string | null;
					name: string;
					role?: string | null;
					url?: string | null;
					uuid: string;
				};
				Update: {
					created_at?: string | null;
					id?: number;
					image_url?: string | null;
					name?: string;
					role?: string | null;
					url?: string | null;
					uuid?: string;
				};
				Relationships: [];
			};
			podcast_colors: {
				Row: {
					colors_dark_muted: string | null;
					colors_dark_vibrant: string | null;
					colors_light_muted: string | null;
					colors_light_vibrant: string | null;
					colors_muted: string | null;
					colors_vibrant: string | null;
					created_at: string;
					id: number;
					podcast_uuid: string;
					updated_at: string | null;
				};
				Insert: {
					colors_dark_muted?: string | null;
					colors_dark_vibrant?: string | null;
					colors_light_muted?: string | null;
					colors_light_vibrant?: string | null;
					colors_muted?: string | null;
					colors_vibrant?: string | null;
					created_at?: string;
					id?: number;
					podcast_uuid: string;
					updated_at?: string | null;
				};
				Update: {
					colors_dark_muted?: string | null;
					colors_dark_vibrant?: string | null;
					colors_light_muted?: string | null;
					colors_light_vibrant?: string | null;
					colors_muted?: string | null;
					colors_vibrant?: string | null;
					created_at?: string;
					id?: number;
					podcast_uuid?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			podcast_episode_enclosures: {
				Row: {
					created_at: string | null;
					episode_uuid: string | null;
					id: number;
					length: number | null;
					type: string | null;
					url: string;
				};
				Insert: {
					created_at?: string | null;
					episode_uuid?: string | null;
					id?: number;
					length?: number | null;
					type?: string | null;
					url: string;
				};
				Update: {
					created_at?: string | null;
					episode_uuid?: string | null;
					id?: number;
					length?: number | null;
					type?: string | null;
					url?: string;
				};
				Relationships: [
					{
						foreignKeyName: "podcast_episode_enclosures_episode_uuid_fkey";
						columns: ["episode_uuid"];
						isOneToOne: false;
						referencedRelation: "podcast_episodes";
						referencedColumns: ["uuid"];
					},
					{
						foreignKeyName: "podcast_episode_enclosures_episode_uuid_fkey";
						columns: ["episode_uuid"];
						isOneToOne: false;
						referencedRelation: "processed_episodes";
						referencedColumns: ["uuid"];
					},
				];
			};
			podcast_episode_people: {
				Row: {
					created_at: string | null;
					episode_uuid: string | null;
					id: number;
					person_uuid: string;
				};
				Insert: {
					created_at?: string | null;
					episode_uuid?: string | null;
					id?: number;
					person_uuid: string;
				};
				Update: {
					created_at?: string | null;
					episode_uuid?: string | null;
					id?: number;
					person_uuid?: string;
				};
				Relationships: [
					{
						foreignKeyName: "podcast_episode_people_episode_uuid_fkey";
						columns: ["episode_uuid"];
						isOneToOne: false;
						referencedRelation: "podcast_episodes";
						referencedColumns: ["uuid"];
					},
					{
						foreignKeyName: "podcast_episode_people_episode_uuid_fkey";
						columns: ["episode_uuid"];
						isOneToOne: false;
						referencedRelation: "processed_episodes";
						referencedColumns: ["uuid"];
					},
					{
						foreignKeyName: "podcast_episode_people_person_uuid_fkey";
						columns: ["person_uuid"];
						isOneToOne: false;
						referencedRelation: "people";
						referencedColumns: ["uuid"];
					},
				];
			};
			podcast_episode_summary: {
				Row: {
					audio_url: string | null;
					created_at: string | null;
					episode_uuid: string | null;
					id: number;
					summary: string | null;
				};
				Insert: {
					audio_url?: string | null;
					created_at?: string | null;
					episode_uuid?: string | null;
					id?: number;
					summary?: string | null;
				};
				Update: {
					audio_url?: string | null;
					created_at?: string | null;
					episode_uuid?: string | null;
					id?: number;
					summary?: string | null;
				};
				Relationships: [];
			};
			podcast_episode_transcripts: {
				Row: {
					created_at: string | null;
					episode_uuid: string | null;
					id: number;
					language: string | null;
					rel: string | null;
					type: string | null;
					url: string | null;
				};
				Insert: {
					created_at?: string | null;
					episode_uuid?: string | null;
					id?: number;
					language?: string | null;
					rel?: string | null;
					type?: string | null;
					url?: string | null;
				};
				Update: {
					created_at?: string | null;
					episode_uuid?: string | null;
					id?: number;
					language?: string | null;
					rel?: string | null;
					type?: string | null;
					url?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "podcast_episode_transcripts_episode_uuid_fkey";
						columns: ["episode_uuid"];
						isOneToOne: false;
						referencedRelation: "podcast_episodes";
						referencedColumns: ["uuid"];
					},
					{
						foreignKeyName: "podcast_episode_transcripts_episode_uuid_fkey";
						columns: ["episode_uuid"];
						isOneToOne: false;
						referencedRelation: "processed_episodes";
						referencedColumns: ["uuid"];
					},
				];
			};
			podcast_episodes: {
				Row: {
					author: string | null;
					category: string[] | null;
					content: string | null;
					content_encoded: string | null;
					created: string | null;
					created_at: string | null;
					description: string | null;
					id: number;
					itunes_author: string | null;
					itunes_duration: string | null;
					itunes_episode: string | null;
					itunes_episode_type: string | null;
					itunes_explicit: string | null;
					itunes_image: string | null;
					itunes_season: string | null;
					itunes_summary: string | null;
					link: string | null;
					podcast_transcript: string | null;
					podcast_uuid: string | null;
					published: string | null;
					title: string;
					updated_at: string | null;
					uuid: string;
				};
				Insert: {
					author?: string | null;
					category?: string[] | null;
					content?: string | null;
					content_encoded?: string | null;
					created?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: number;
					itunes_author?: string | null;
					itunes_duration?: string | null;
					itunes_episode?: string | null;
					itunes_episode_type?: string | null;
					itunes_explicit?: string | null;
					itunes_image?: string | null;
					itunes_season?: string | null;
					itunes_summary?: string | null;
					link?: string | null;
					podcast_transcript?: string | null;
					podcast_uuid?: string | null;
					published?: string | null;
					title: string;
					updated_at?: string | null;
					uuid: string;
				};
				Update: {
					author?: string | null;
					category?: string[] | null;
					content?: string | null;
					content_encoded?: string | null;
					created?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: number;
					itunes_author?: string | null;
					itunes_duration?: string | null;
					itunes_episode?: string | null;
					itunes_episode_type?: string | null;
					itunes_explicit?: string | null;
					itunes_image?: string | null;
					itunes_season?: string | null;
					itunes_summary?: string | null;
					link?: string | null;
					podcast_transcript?: string | null;
					podcast_uuid?: string | null;
					published?: string | null;
					title?: string;
					updated_at?: string | null;
					uuid?: string;
				};
				Relationships: [];
			};
			podcast_people: {
				Row: {
					created_at: string | null;
					id: number;
					person_uuid: string;
					podcast_uuid: string;
				};
				Insert: {
					created_at?: string | null;
					id?: number;
					person_uuid: string;
					podcast_uuid: string;
				};
				Update: {
					created_at?: string | null;
					id?: number;
					person_uuid?: string;
					podcast_uuid?: string;
				};
				Relationships: [
					{
						foreignKeyName: "podcast_people_person_uuid_fkey";
						columns: ["person_uuid"];
						isOneToOne: false;
						referencedRelation: "people";
						referencedColumns: ["uuid"];
					},
					{
						foreignKeyName: "podcast_people_podcast_uuid_fkey";
						columns: ["podcast_uuid"];
						isOneToOne: false;
						referencedRelation: "podcast_series";
						referencedColumns: ["uuid"];
					},
				];
			};
			podcast_series: {
				Row: {
					author_name: string | null;
					children_hash: string | null;
					colors_dark_muted: string | null;
					colors_dark_vibrant: string | null;
					colors_light_muted: string | null;
					colors_light_vibrant: string | null;
					colors_muted: string | null;
					colors_vibrant: string | null;
					content_type: string | null;
					copyright: string | null;
					country_of_origin: string | null;
					created_at: string;
					date_published: string | null;
					description: string | null;
					genres_hash: string | null;
					hash: string | null;
					hash_timestamp: number | null;
					id: number;
					image_url: string | null;
					is_blocked: boolean | null;
					is_completed: boolean | null;
					is_explicit_content: boolean | null;
					itunes_id: number | null;
					itunes_info_hash: string | null;
					language: string | null;
					name: string | null;
					rss_owner_name: string | null;
					rss_owner_public_email: string | null;
					rss_url: string | null;
					series_type: string | null;
					source: string | null;
					updated_at: string | null;
					uuid: string;
					website_url: string | null;
				};
				Insert: {
					author_name?: string | null;
					children_hash?: string | null;
					colors_dark_muted?: string | null;
					colors_dark_vibrant?: string | null;
					colors_light_muted?: string | null;
					colors_light_vibrant?: string | null;
					colors_muted?: string | null;
					colors_vibrant?: string | null;
					content_type?: string | null;
					copyright?: string | null;
					country_of_origin?: string | null;
					created_at?: string;
					date_published?: string | null;
					description?: string | null;
					genres_hash?: string | null;
					hash?: string | null;
					hash_timestamp?: number | null;
					id?: number;
					image_url?: string | null;
					is_blocked?: boolean | null;
					is_completed?: boolean | null;
					is_explicit_content?: boolean | null;
					itunes_id?: number | null;
					itunes_info_hash?: string | null;
					language?: string | null;
					name?: string | null;
					rss_owner_name?: string | null;
					rss_owner_public_email?: string | null;
					rss_url?: string | null;
					series_type?: string | null;
					source?: string | null;
					updated_at?: string | null;
					uuid: string;
					website_url?: string | null;
				};
				Update: {
					author_name?: string | null;
					children_hash?: string | null;
					colors_dark_muted?: string | null;
					colors_dark_vibrant?: string | null;
					colors_light_muted?: string | null;
					colors_light_vibrant?: string | null;
					colors_muted?: string | null;
					colors_vibrant?: string | null;
					content_type?: string | null;
					copyright?: string | null;
					country_of_origin?: string | null;
					created_at?: string;
					date_published?: string | null;
					description?: string | null;
					genres_hash?: string | null;
					hash?: string | null;
					hash_timestamp?: number | null;
					id?: number;
					image_url?: string | null;
					is_blocked?: boolean | null;
					is_completed?: boolean | null;
					is_explicit_content?: boolean | null;
					itunes_id?: number | null;
					itunes_info_hash?: string | null;
					language?: string | null;
					name?: string | null;
					rss_owner_name?: string | null;
					rss_owner_public_email?: string | null;
					rss_url?: string | null;
					series_type?: string | null;
					source?: string | null;
					updated_at?: string | null;
					uuid?: string;
					website_url?: string | null;
				};
				Relationships: [];
			};
			podcast_user_settings: {
				Row: {
					back_skip: number | null;
					continuous_playback: boolean | null;
					created_at: string | null;
					forward_skip: number | null;
					id: number;
					playback_speed: number | null;
					podcast_uuid: string;
					user_id: string;
				};
				Insert: {
					back_skip?: number | null;
					continuous_playback?: boolean | null;
					created_at?: string | null;
					forward_skip?: number | null;
					id?: number;
					playback_speed?: number | null;
					podcast_uuid: string;
					user_id: string;
				};
				Update: {
					back_skip?: number | null;
					continuous_playback?: boolean | null;
					created_at?: string | null;
					forward_skip?: number | null;
					id?: number;
					playback_speed?: number | null;
					podcast_uuid?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			stop_words: {
				Row: {
					word: string;
				};
				Insert: {
					word: string;
				};
				Update: {
					word?: string;
				};
				Relationships: [];
			};
			subscriptions: {
				Row: {
					group_key: string | null;
					id: number;
					podcast_uuid: string;
					subscribed_at: string | null;
					user_id: string;
				};
				Insert: {
					group_key?: string | null;
					id?: number;
					podcast_uuid: string;
					subscribed_at?: string | null;
					user_id: string;
				};
				Update: {
					group_key?: string | null;
					id?: number;
					podcast_uuid?: string;
					subscribed_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			user_queue: {
				Row: {
					added_at: string | null;
					episode_uuid: string;
					id: number;
					position: number;
					user_id: string;
				};
				Insert: {
					added_at?: string | null;
					episode_uuid: string;
					id?: number;
					position: number;
					user_id: string;
				};
				Update: {
					added_at?: string | null;
					episode_uuid?: string;
					id?: number;
					position?: number;
					user_id?: string;
				};
				Relationships: [];
			};
			user_settings: {
				Row: {
					back_skip: number | null;
					continuous_playback: boolean | null;
					created_at: string | null;
					forward_skip: number | null;
					id: number;
					playback_speed: number | null;
					user_id: string;
				};
				Insert: {
					back_skip?: number | null;
					continuous_playback?: boolean | null;
					created_at?: string | null;
					forward_skip?: number | null;
					id?: number;
					playback_speed?: number | null;
					user_id: string;
				};
				Update: {
					back_skip?: number | null;
					continuous_playback?: boolean | null;
					created_at?: string | null;
					forward_skip?: number | null;
					id?: number;
					playback_speed?: number | null;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			processed_episodes: {
				Row: {
					author: string | null;
					category: string[] | null;
					content: string | null;
					content_encoded: string | null;
					created: string | null;
					created_at: string | null;
					day_of_week: number | null;
					description: string | null;
					id: number | null;
					itunes_author: string | null;
					itunes_duration: string | null;
					itunes_episode: string | null;
					itunes_episode_type: string | null;
					itunes_explicit: string | null;
					itunes_image: string | null;
					itunes_season: string | null;
					itunes_summary: string | null;
					link: string | null;
					podcast_transcript: string | null;
					podcast_uuid: string | null;
					processed_title_colon: string | null;
					processed_title_dash: string | null;
					published: string | null;
					title: string | null;
					updated_at: string | null;
					uuid: string | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			determine_separator: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			remove_numbers: {
				Args: { "": string };
				Returns: string;
			};
			remove_single_letter_words: {
				Args: { input_text: string };
				Returns: string;
			};
			remove_special_chars: {
				Args: { "": string };
				Returns: string;
			};
			remove_stop_words: {
				Args: { input_text: string };
				Returns: string;
			};
		};
		Enums: {
			group_rule_type: "word" | "weekday";
			subscription_type: "podcast" | "group";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			group_rule_type: ["word", "weekday"],
			subscription_type: ["podcast", "group"],
		},
	},
} as const;
