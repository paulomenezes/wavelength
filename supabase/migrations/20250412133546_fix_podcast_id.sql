-- Drop existing indexes
drop index if exists idx_listening_history_podcast_id;
drop index if exists idx_listening_history_episode_id;
drop index if exists idx_listening_history_user_id_podcast_id;
drop index if exists idx_listening_history_user_id_podcast_id_episode_id;
drop index if exists idx_user_queue_episode_id;
drop index if exists idx_user_queue_user_id_episode_id;
drop index if exists idx_chapters_episode_id;
drop index if exists idx_podcast_user_settings_podcast_id;
drop index if exists idx_podcast_user_settings_user_id_podcast_id;
drop index if exists idx_favorites_episode_id;
drop index if exists idx_favorites_user_id_episode_id;
drop index if exists idx_subscriptions_podcast_id;
drop index if exists idx_subscriptions_user_id_podcast_id;

-- Rename columns
alter table listening_history rename column podcast_id to podcast_uuid;
alter table listening_history rename column episode_id to episode_uuid;
alter table groups rename column podcast_id to podcast_uuid;
alter table user_queue rename column episode_id to episode_uuid;
alter table chapters rename column episode_id to episode_uuid;
alter table podcast_user_settings rename column podcast_id to podcast_uuid;
alter table favorites rename column episode_id to episode_uuid;
alter table subscriptions rename column podcast_id to podcast_uuid;

-- Remove default values
alter table listening_history alter column podcast_uuid drop default;
alter table listening_history alter column episode_uuid drop default;
alter table groups alter column podcast_uuid drop default;
alter table user_queue alter column episode_uuid drop default;
alter table chapters alter column episode_uuid drop default;
alter table podcast_user_settings alter column podcast_uuid drop default;
alter table favorites alter column episode_uuid drop default;
alter table subscriptions alter column podcast_uuid drop default;

-- Alter column types with conversion
alter table listening_history alter column podcast_uuid type uuid using md5(podcast_uuid::text)::uuid;
alter table listening_history alter column episode_uuid type uuid using md5(episode_uuid::text)::uuid;
alter table groups alter column podcast_uuid type uuid using md5(podcast_uuid::text)::uuid;
alter table user_queue alter column episode_uuid type uuid using md5(episode_uuid::text)::uuid;
alter table chapters alter column episode_uuid type uuid using md5(episode_uuid::text)::uuid;
alter table podcast_user_settings alter column podcast_uuid type uuid using md5(podcast_uuid::text)::uuid;
alter table favorites alter column episode_uuid type uuid using md5(episode_uuid::text)::uuid;
alter table subscriptions alter column podcast_uuid type uuid using md5(podcast_uuid::text)::uuid;

-- Recreate indexes
create index idx_listening_history_podcast_uuid on listening_history (podcast_uuid);
create index idx_listening_history_episode_uuid on listening_history (episode_uuid);
create index idx_listening_history_user_id_podcast_uuid on listening_history (user_id, podcast_uuid);
create index idx_listening_history_user_id_podcast_uuid_episode_uuid on listening_history (user_id, podcast_uuid, episode_uuid);
create index idx_user_queue_episode_uuid on user_queue (episode_uuid);
create index idx_user_queue_user_id_episode_uuid on user_queue (user_id, episode_uuid);
create index idx_chapters_episode_uuid on chapters (episode_uuid);
create index idx_podcast_user_settings_podcast_uuid on podcast_user_settings (podcast_uuid);
create index idx_podcast_user_settings_user_id_podcast_uuid on podcast_user_settings (user_id, podcast_uuid);
create index idx_favorites_episode_uuid on favorites (episode_uuid);
create index idx_favorites_user_id_episode_uuid on favorites (user_id, episode_uuid);
create index idx_subscriptions_podcast_uuid on subscriptions (podcast_uuid);
create index idx_subscriptions_user_id_podcast_uuid on subscriptions (user_id, podcast_uuid);
