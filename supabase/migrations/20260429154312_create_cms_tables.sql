/*
  # Create CMS Tables for Admin Panel

  1. New Tables
    - `cms_leaders` - Global Leaders Network section
      - id, name, title, company, image_url, order_index, is_active
    - `leadership_videos` - Meet Our Leaders video section
      - id, name, role, video_url, thumbnail_url, duration, order_index, is_active
    - `testimonial_videos` - Success Stories video section
      - id, member_name, business_name, city, video_url, thumbnail_url, duration, order_index, is_active
    - `event_videos` - Event Highlights video section
      - id, title, event_id, video_url, thumbnail_url, duration, order_index, is_active
    - `admin_users` - Tracks which auth users are admins

  2. Security
    - RLS enabled on all tables
    - Public read access for active/featured content
    - Admin-only write access
*/

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin list"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- CMS Leaders table
CREATE TABLE IF NOT EXISTS cms_leaders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_leaders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active leaders"
  ON cms_leaders FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert leaders"
  ON cms_leaders FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can update leaders"
  ON cms_leaders FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete leaders"
  ON cms_leaders FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Leadership Videos table
CREATE TABLE IF NOT EXISTS leadership_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  duration integer DEFAULT 0,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leadership_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active leadership videos"
  ON leadership_videos FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert leadership videos"
  ON leadership_videos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can update leadership videos"
  ON leadership_videos FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete leadership videos"
  ON leadership_videos FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Testimonial Videos table
CREATE TABLE IF NOT EXISTS testimonial_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name text NOT NULL DEFAULT '',
  business_name text DEFAULT '',
  city text DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  duration integer DEFAULT 0,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonial_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonial videos"
  ON testimonial_videos FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert testimonial videos"
  ON testimonial_videos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can update testimonial videos"
  ON testimonial_videos FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete testimonial videos"
  ON testimonial_videos FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Event Videos table
CREATE TABLE IF NOT EXISTS event_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  event_id uuid DEFAULT NULL,
  video_url text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  duration integer DEFAULT 0,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE event_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active event videos"
  ON event_videos FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert event videos"
  ON event_videos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can update event videos"
  ON event_videos FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete event videos"
  ON event_videos FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
