CREATE OR REPLACE FUNCTION remove_special_chars(text) 
RETURNS text AS $$
BEGIN
    RETURN regexp_replace(
        regexp_replace(
            regexp_replace($1, '''', '', 'g'),
            '"', '', 'g'
        ),
        '\.', '', 'g'
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_numbers(text) 
RETURNS text AS $$
BEGIN
    RETURN regexp_replace($1, '\d+', '', 'g');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_stop_words(input_text text) 
RETURNS text AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM stop_words sw WHERE sw.word = lower(input_text)) THEN
        RETURN '';
    END IF;
    RETURN input_text;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_single_letter_words(input_text text) 
RETURNS text AS $$
DECLARE
    current_word text;
    result text := '';
BEGIN
    FOREACH current_word IN ARRAY string_to_array(input_text, ' ')
    LOOP
        IF length(current_word) > 1 THEN
            result := result || ' ' || current_word;
        END IF;
    END LOOP;
    RETURN trim(result);
END;
$$ LANGUAGE plpgsql;

DROP MATERIALIZED VIEW IF EXISTS processed_episodes;

CREATE MATERIALIZED VIEW processed_episodes AS
SELECT 
    pe.*,
    remove_single_letter_words(
        remove_stop_words(
            remove_numbers(
                remove_special_chars(
                    split_part(pe.title, '-', 1)
                )
            )
        )
    ) as processed_title_dash,
    remove_single_letter_words(
        remove_stop_words(
            remove_numbers(
                remove_special_chars(
                    split_part(pe.title, ':', 1)
                )
            )
        )
    ) as processed_title_colon
FROM podcast_episodes pe;

CREATE INDEX idx_processed_title_dash ON processed_episodes (processed_title_dash);
CREATE INDEX idx_processed_title_colon ON processed_episodes (processed_title_colon);

CREATE OR REPLACE FUNCTION update_processed_episodes()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY processed_episodes;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_processed_episodes_trigger
AFTER INSERT OR UPDATE OR DELETE ON podcast_episodes
FOR EACH STATEMENT
EXECUTE FUNCTION update_processed_episodes();