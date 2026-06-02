-- Seed sample users, follows, and posts for the Instagram feed backend.
-- Run with: psql postgresql://localhost:5432/instagram_feed -f migrations/seed_data.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(128);

TRUNCATE TABLE follows RESTART IDENTITY CASCADE;
TRUNCATE TABLE posts RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

INSERT INTO users (username, display_name) VALUES
  ('alice', 'Alice Johnson'),
  ('bob', 'Bob Lee'),
  ('clara', 'Clara Park');

INSERT INTO follows (user_id, followed_user_id) VALUES
  (1, 2), -- Alice follows Bob
  (1, 3), -- Alice follows Clara
  (2, 3); -- Bob follows Clara

INSERT INTO posts (user_id, image_url, caption, metadata, created_at) VALUES
  (1, 'https://images.example.com/alice-sunset.jpg', 'Golden hour on the rooftop.', '{"location": "NYC", "likes": 120}', NOW() - INTERVAL '2 minutes'),
  (2, 'https://images.example.com/bob-surf.jpg', 'Morning surf session.', '{"location": "Santa Monica", "likes": 92}', NOW() - INTERVAL '5 minutes'),
  (3, 'https://images.example.com/clara-coffee.jpg', 'Latte art and weekend vibes.', '{"location": "Seattle", "likes": 84}', NOW() - INTERVAL '10 minutes'),
  (2, 'https://images.example.com/bob-city.jpg', 'City lights after dark.', '{"location": "LA", "likes": 67}', NOW() - INTERVAL '20 minutes'),
  (1, 'https://images.example.com/alice-hike.jpg', 'Trail views this morning.', '{"location": "Bear Mountain", "likes": 205}', NOW() - INTERVAL '30 minutes');

-- Optional verification
SELECT * FROM users ORDER BY id;
SELECT * FROM follows ORDER BY user_id, followed_user_id;
SELECT * FROM posts ORDER BY created_at DESC;
