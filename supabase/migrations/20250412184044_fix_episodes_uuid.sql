-- First drop all foreign key constraints
ALTER TABLE podcast_episode_enclosures 
    DROP CONSTRAINT IF EXISTS podcast_episode_enclosures_episode_uuid_fkey;

ALTER TABLE podcast_episode_people 
    DROP CONSTRAINT IF EXISTS podcast_episode_people_episode_uuid_fkey,
    DROP CONSTRAINT IF EXISTS podcast_episode_people_person_uuid_fkey;

ALTER TABLE podcast_episode_transcripts 
    DROP CONSTRAINT IF EXISTS podcast_episode_transcripts_episode_uuid_fkey;

-- Change UUID columns to TEXT type
ALTER TABLE people ALTER COLUMN uuid TYPE TEXT;
ALTER TABLE podcast_episodes ALTER COLUMN uuid TYPE TEXT;
ALTER TABLE podcast_episode_enclosures ALTER COLUMN episode_uuid TYPE TEXT;
ALTER TABLE podcast_episode_people ALTER COLUMN episode_uuid TYPE TEXT;
ALTER TABLE podcast_episode_people ALTER COLUMN person_uuid TYPE TEXT;
ALTER TABLE podcast_episode_transcripts ALTER COLUMN episode_uuid TYPE TEXT;

-- Recreate foreign key constraints
ALTER TABLE podcast_episode_enclosures 
    ADD CONSTRAINT podcast_episode_enclosures_episode_uuid_fkey 
    FOREIGN KEY (episode_uuid) REFERENCES podcast_episodes(uuid) ON DELETE CASCADE;

ALTER TABLE podcast_episode_people 
    ADD CONSTRAINT podcast_episode_people_episode_uuid_fkey 
    FOREIGN KEY (episode_uuid) REFERENCES podcast_episodes(uuid) ON DELETE CASCADE,
    ADD CONSTRAINT podcast_episode_people_person_uuid_fkey 
    FOREIGN KEY (person_uuid) REFERENCES people(uuid) ON DELETE CASCADE;

ALTER TABLE podcast_episode_transcripts 
    ADD CONSTRAINT podcast_episode_transcripts_episode_uuid_fkey 
    FOREIGN KEY (episode_uuid) REFERENCES podcast_episodes(uuid) ON DELETE CASCADE;
