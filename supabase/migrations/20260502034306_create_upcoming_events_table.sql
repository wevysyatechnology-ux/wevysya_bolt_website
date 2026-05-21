/*
  # Create upcoming_events table

  This table stores admin-managed upcoming events shown on the public Events page.

  1. New Table: `upcoming_events`
    - `id` (uuid, primary key)
    - `title` (text) - Event title
    - `event_date` (date) - Date of the event
    - `image_url` (text) - Event image (displayed at 3:4 ratio)
    - `description` (text) - Event description
    - `is_active` (boolean) - Whether to show on frontend
    - `order_index` (integer) - Display order
    - `created_at`, `updated_at` (timestamps)

  2. Security
    - RLS enabled
    - Public SELECT for all
    - Authenticated users can INSERT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS upcoming_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  event_date date NOT NULL,
  image_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE upcoming_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view upcoming events"
  ON upcoming_events FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert upcoming events"
  ON upcoming_events FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update upcoming events"
  ON upcoming_events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete upcoming events"
  ON upcoming_events FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_upcoming_events_date ON upcoming_events(event_date);
CREATE INDEX IF NOT EXISTS idx_upcoming_events_order ON upcoming_events(order_index);
