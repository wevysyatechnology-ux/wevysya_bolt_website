/*
  # CMS Tables + Website Admins with Roles

  1. New Tables
    - website_admins: Separate admin accounts for this website (not linked to member users)
      - id (uuid, references auth.users)
      - role: 'superadmin' | 'editor' | 'moderator'
    - cms_leaders, leadership_videos, testimonial_videos, event_videos

  2. Roles
    - superadmin: Full access — CMS + admin management
    - editor: Add/edit/delete CMS content
    - moderator: Read-only access

  3. Security
    - RLS enabled on all tables
    - CMS write policies check website_admins role
*/

-- Website admins table (separate from member users)
CREATE TABLE IF NOT EXISTS website_admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('superadmin', 'editor', 'moderator')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE website_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Website admins can read admin list"
  ON website_admins FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins wa WHERE wa.id = auth.uid()));

CREATE POLICY "Superadmins can insert admins"
  ON website_admins FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins wa WHERE wa.id = auth.uid() AND wa.role = 'superadmin'));

CREATE POLICY "Superadmins can update admin roles"
  ON website_admins FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins wa WHERE wa.id = auth.uid() AND wa.role = 'superadmin'))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins wa WHERE wa.id = auth.uid() AND wa.role = 'superadmin'));

CREATE POLICY "Superadmins can delete admins"
  ON website_admins FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins wa WHERE wa.id = auth.uid() AND wa.role = 'superadmin'));

-- CMS Leaders
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

CREATE POLICY "Website admins can insert leaders"
  ON cms_leaders FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

CREATE POLICY "Website admins can update leaders"
  ON cms_leaders FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

CREATE POLICY "Website admins can delete leaders"
  ON cms_leaders FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

-- Leadership Videos
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

CREATE POLICY "Website admins can insert leadership videos"
  ON leadership_videos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

CREATE POLICY "Website admins can update leadership videos"
  ON leadership_videos FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

CREATE POLICY "Website admins can delete leadership videos"
  ON leadership_videos FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

-- Testimonial Videos
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

CREATE POLICY "Website admins can insert testimonial videos"
  ON testimonial_videos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

CREATE POLICY "Website admins can update testimonial videos"
  ON testimonial_videos FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

CREATE POLICY "Website admins can delete testimonial videos"
  ON testimonial_videos FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

-- Event Videos
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

CREATE POLICY "Website admins can insert event videos"
  ON event_videos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

CREATE POLICY "Website admins can update event videos"
  ON event_videos FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));

CREATE POLICY "Website admins can delete event videos"
  ON event_videos FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin', 'editor')));
