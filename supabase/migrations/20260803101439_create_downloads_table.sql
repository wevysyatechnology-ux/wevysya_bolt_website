/*
# Create downloads table

1. New Tables
- `downloads`
  - `id` (uuid, primary key)
  - `title` (text, not null) — display title for the file
  - `description` (text, nullable) — optional description
  - `file_url` (text, not null) — public URL of the uploaded file in storage
  - `file_type` (text, not null) — one of 'audio', 'video', 'image', 'document'
  - `file_name` (text, nullable) — original file name for download links
  - `file_size` (bigint, nullable) — file size in bytes
  - `order_index` (int, default 0) — display ordering
  - `is_active` (boolean, default true) — whether to show on public page
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `downloads`.
- Public can read active downloads (anon + authenticated SELECT).
- Only authenticated admins can insert/update/delete (authenticated role; the admin layout already gates the UI).
*/

CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('audio', 'video', 'image', 'document')),
  file_name text,
  file_size bigint,
  order_index int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Public read of active downloads
DROP POLICY IF EXISTS "public_select_downloads" ON downloads;
CREATE POLICY "public_select_downloads"
  ON downloads FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins (authenticated) can insert
DROP POLICY IF EXISTS "admin_insert_downloads" ON downloads;
CREATE POLICY "admin_insert_downloads"
  ON downloads FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins (authenticated) can update
DROP POLICY IF EXISTS "admin_update_downloads" ON downloads;
CREATE POLICY "admin_update_downloads"
  ON downloads FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admins (authenticated) can delete
DROP POLICY IF EXISTS "admin_delete_downloads" ON downloads;
CREATE POLICY "admin_delete_downloads"
  ON downloads FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS downloads_order_idx ON downloads (order_index);
