DROP MATERIALIZED VIEW processed_episodes;

CREATE MATERIALIZED VIEW processed_episodes AS
SELECT 
    pe.*,
    remove_single_letter_words(
        trim(remove_stop_words(
            trim(remove_numbers(
                trim(remove_special_chars(
                    trim(CASE 
                        WHEN pe.title LIKE '%-%' THEN split_part(pe.title, '-', 1)
                        ELSE ''
                    END)
                ))
            ))
        ))
    ) as processed_title_dash,
    remove_single_letter_words(
        trim(remove_stop_words(
            trim(remove_numbers(
                trim(remove_special_chars(
                    trim(CASE 
                        WHEN pe.title LIKE '%:%' THEN split_part(pe.title, ':', 1)
                        ELSE ''
                    END)
                ))
            ))
        ))
    ) as processed_title_colon,
    EXTRACT(DOW FROM pe.published) as day_of_week
FROM podcast_episodes pe;

CREATE UNIQUE INDEX ON processed_episodes (id);
CREATE INDEX idx_processed_title_dash ON processed_episodes (processed_title_dash);
CREATE INDEX idx_processed_title_colon ON processed_episodes (processed_title_colon);
CREATE INDEX idx_day_of_week ON processed_episodes (day_of_week);

CREATE OR REPLACE FUNCTION update_processed_episodes()
RETURNS TRIGGER 
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY processed_episodes;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_processed_episodes_trigger
AFTER INSERT OR UPDATE OR DELETE ON podcast_episodes
FOR EACH STATEMENT
EXECUTE FUNCTION update_processed_episodes();