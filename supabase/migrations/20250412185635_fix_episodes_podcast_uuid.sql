ALTER TABLE podcast_episodes
ADD COLUMN podcast_uuid TEXT;

-- Create table for podcast people
CREATE TABLE podcast_people (
    id BIGSERIAL PRIMARY KEY,
    podcast_uuid UUID NOT NULL REFERENCES podcast_series(uuid) ON DELETE CASCADE,
    person_uuid TEXT NOT NULL REFERENCES people(uuid) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_podcast_people_podcast_uuid ON podcast_people(podcast_uuid);
CREATE INDEX idx_podcast_people_person_uuid ON podcast_people(person_uuid);