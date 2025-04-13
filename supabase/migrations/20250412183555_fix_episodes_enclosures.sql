ALTER TABLE podcast_episode_enclosures
ALTER COLUMN url TYPE TEXT;

ALTER TABLE podcast_episode_transcripts
RENAME COLUMN url TO rel;
