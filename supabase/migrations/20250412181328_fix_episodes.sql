DROP TABLE podcast_episode;

-- Create table for people
CREATE TABLE people (
    id BIGSERIAL,
    uuid UUID NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    url TEXT,
    role TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create the main episodes table
CREATE TABLE podcast_episodes (
    id BIGSERIAL,
    uuid uuid PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    author TEXT,
    published TIMESTAMP,
    created TIMESTAMP DEFAULT NOW(),
    category TEXT[],
    content TEXT,
    content_encoded TEXT,
    podcast_transcript TEXT,
    itunes_summary TEXT,
    itunes_author TEXT,
    itunes_explicit TEXT,
    itunes_duration TEXT,
    itunes_season TEXT,
    itunes_episode TEXT,
    itunes_episode_type TEXT,
    itunes_image TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create table for episode enclosures
CREATE TABLE podcast_episode_enclosures (
    id BIGSERIAL PRIMARY KEY,
    episode_uuid UUID REFERENCES podcast_episodes(uuid) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT,
    length INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for episode people
CREATE TABLE podcast_episode_people (
    id BIGSERIAL PRIMARY KEY,
    episode_uuid UUID REFERENCES podcast_episodes(uuid) ON DELETE CASCADE,
    person_uuid UUID NOT NULL REFERENCES people(uuid) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for episode transcripts
CREATE TABLE podcast_episode_transcripts (
    id BIGSERIAL PRIMARY KEY,
    episode_uuid UUID REFERENCES podcast_episodes(uuid) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT,
    language TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_podcast_episodes_published ON podcast_episodes(published);
CREATE INDEX idx_podcast_episodes_created ON podcast_episodes(created);
CREATE INDEX idx_podcast_episode_enclosures_episode_uuid ON podcast_episode_enclosures(episode_uuid);
CREATE INDEX idx_podcast_episode_people_episode_uuid ON podcast_episode_people(episode_uuid);
CREATE INDEX idx_podcast_episode_people_person_uuid ON podcast_episode_people(person_uuid);
CREATE INDEX idx_podcast_episode_transcripts_episode_uuid ON podcast_episode_transcripts(episode_uuid);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_podcast_episodes_updated_at
    BEFORE UPDATE ON podcast_episodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
