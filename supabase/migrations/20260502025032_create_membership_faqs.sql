/*
  # Create membership_faqs table

  1. New Tables
    - `membership_faqs`
      - `id` (uuid, primary key)
      - `question` (text, the FAQ question)
      - `answer` (text, the FAQ answer)
      - `order_index` (integer, display order)
      - `is_active` (boolean, whether to show on site)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `membership_faqs` table
    - Public SELECT policy for active FAQs (visible to all visitors)
    - Authenticated users (admins) can INSERT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS membership_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE membership_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active faqs"
  ON membership_faqs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert faqs"
  ON membership_faqs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update faqs"
  ON membership_faqs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete faqs"
  ON membership_faqs FOR DELETE
  TO authenticated
  USING (true);
