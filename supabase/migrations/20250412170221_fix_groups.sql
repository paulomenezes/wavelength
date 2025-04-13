ALTER TABLE subscriptions
DROP COLUMN group_id,
DROP COLUMN subscription_type;

DROP TABLE user_groups;
DROP TABLE group_rules;
DROP TABLE groups;

ALTER TABLE subscriptions
ADD COLUMN group_key text;