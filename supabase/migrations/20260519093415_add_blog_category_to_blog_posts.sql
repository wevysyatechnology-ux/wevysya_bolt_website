/*
  # Add 'blog' category to blog_posts

  1. Changes
    - Drop existing CHECK constraint on category column
    - Add new CHECK constraint that includes 'blog' as a valid category

  2. Notes
    - Existing data is unaffected
    - 'blog' is now a valid category alongside success_story, business_tip, recipe, podcast
*/

ALTER TABLE blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_category_check;

ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_category_check
  CHECK (category IN ('success_story', 'business_tip', 'recipe', 'podcast', 'blog'));
