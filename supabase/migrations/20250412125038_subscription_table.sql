create table listening_history (
  id bigserial primary key,
  user_id varchar(255) not null,
  podcast_id bigserial not null,
  episode_id bigserial not null,
  listened_at timestamptz default now(),
  progress float not null,
  duration float not null
);

create index idx_listening_history_user_id on listening_history (user_id);
create index idx_listening_history_podcast_id on listening_history (podcast_id);
create index idx_listening_history_episode_id on listening_history (episode_id);
create index idx_listening_history_user_id_podcast_id on listening_history (user_id, podcast_id);
create index idx_listening_history_user_id_podcast_id_episode_id on listening_history (user_id, podcast_id, episode_id);

create table groups (
  id bigserial primary key,
  podcast_id bigserial not null,
  name text not null,
  is_system boolean default false,
  created_at timestamptz default now()
);

create type group_rule_type as enum ('word', 'weekday');

create table group_rules (
  id bigserial primary key,
  group_id bigserial not null references groups (id),
  rule_type group_rule_type not null,
  rule_value text not null,
  created_at timestamptz default now()
);

create index idx_group_rules_group_id on group_rules (group_id);

create table user_groups (
  id bigserial primary key,
  user_id varchar(255) not null,
  group_id bigserial not null references groups (id),
  is_hidden boolean default false,
  created_at timestamptz default now()
);

create index idx_user_groups_user_id on user_groups (user_id);
create index idx_user_groups_group_id on user_groups (group_id);

create table user_queue (
  id bigserial primary key,
  user_id varchar(255) not null,
  episode_id bigserial not null,
  position int not null,
  added_at timestamptz default now()
);

create index idx_user_queue_user_id on user_queue (user_id);
create index idx_user_queue_episode_id on user_queue (episode_id);
create index idx_user_queue_user_id_episode_id on user_queue (user_id, episode_id);

create table chapters (
  id bigserial primary key,
  episode_id bigserial not null,
  title text not null,
  start_time int not null,
  end_time int not null,
  created_at timestamptz default now()
);

create index idx_chapters_episode_id on chapters (episode_id);

create table user_settings (
  id bigserial primary key,
  user_id varchar(255) not null,
  playback_speed numeric(3, 2) default 1.0,
  forward_skip int default 30,
  back_skip int default 30,
  continuous_playback boolean default true,
  created_at timestamptz default now()
);

create index idx_user_settings_user_id on user_settings (user_id);

create table podcast_user_settings (
  id bigserial primary key,
  user_id varchar(255) not null,
  podcast_id bigserial not null,
  playback_speed numeric(3, 2) default 1.0,
  forward_skip int default 30,
  back_skip int default 30,
  continuous_playback boolean default true,
  created_at timestamptz default now()
);

create index idx_podcast_user_settings_user_id on podcast_user_settings (user_id);
create index idx_podcast_user_settings_podcast_id on podcast_user_settings (podcast_id);
create index idx_podcast_user_settings_user_id_podcast_id on podcast_user_settings (user_id, podcast_id);

create table favorites (
  id bigserial primary key,
  user_id varchar(255) not null,
  episode_id bigserial not null,
  favorited_at timestamptz default now()
);

create index idx_favorites_user_id on favorites (user_id);
create index idx_favorites_episode_id on favorites (episode_id);
create index idx_favorites_user_id_episode_id on favorites (user_id, episode_id);

create type subscription_type as enum ('podcast', 'group');

create table subscriptions (
  id bigserial primary key,
  user_id varchar(255) not null,
  podcast_id bigserial not null,
  subscription_type subscription_type not null,
  group_id bigserial references groups (id),
  subscribed_at timestamptz default now()
);

create index idx_subscriptions_user_id on subscriptions (user_id);
create index idx_subscriptions_podcast_id on subscriptions (podcast_id);
create index idx_subscriptions_user_id_podcast_id on subscriptions (user_id, podcast_id);
create index idx_subscriptions_user_id_group_id on subscriptions (user_id, group_id);