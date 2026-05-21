/*
  # Create global_leaders table

  1. New Table
    - `global_leaders`
      - `id` (uuid, primary key)
      - `role` (text) — one of: 'Global President', 'Past President', 'President Elect', 'Council President'
      - `name` (text)
      - `image_url` (text)
      - `is_active` (boolean, default true)
      - `created_at`, `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public SELECT for active records (homepage display)
    - Authenticated users (admins) can INSERT, UPDATE, DELETE

  3. Notes
    - Exactly 4 roles are enforced via a CHECK constraint
    - role column is UNIQUE so only one record per role
*/

CREATE TABLE IF NOT EXISTS global_leaders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  name text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT global_leaders_role_check CHECK (
    role IN ('Global President', 'Past President', 'President Elect', 'Council President')
  ),
  CONSTRAINT global_leaders_role_unique UNIQUE (role)
);

ALTER TABLE global_leaders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active global leaders"
  ON global_leaders FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert global leaders"
  ON global_leaders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update global leaders"
  ON global_leaders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete global leaders"
  ON global_leaders FOR DELETE
  TO authenticated
  USING (true);

-- Seed one placeholder row per role so all 4 cards always appear
INSERT INTO global_leaders (role, name, image_url, is_active)
VALUES
  ('Global President',   '', '', false),
  ('Past President',     '', '', false),
  ('President Elect',    '', '', false),
  ('Council President',  '', '', false)
ON CONFLICT (role) DO NOTHING;
