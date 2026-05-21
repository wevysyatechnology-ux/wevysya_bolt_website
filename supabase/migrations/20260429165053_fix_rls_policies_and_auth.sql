
/*
  # Fix RLS Policies for Admin Access

  ## Problem
  The website_admins SELECT policy was causing a circular dependency during Supabase auth
  token generation ("Database error querying schema"). The policy checked website_admins
  FROM WITHIN website_admins, which creates a recursive loop during auth.

  ## Changes
  1. Drop and recreate website_admins policies using auth.uid() directly (no subquery loop)
  2. Add missing SELECT policies for admins on membership_applications and visitor_registrations
  3. Add missing SELECT/INSERT policy for profiles
  4. Add missing SELECT policies for admins on events, blog_posts, testimonials
*/

-- ============================================================
-- FIX: website_admins policies (remove circular subquery)
-- ============================================================

DROP POLICY IF EXISTS "Admins can view admin list" ON website_admins;
DROP POLICY IF EXISTS "Superadmin can insert admins" ON website_admins;
DROP POLICY IF EXISTS "Superadmin can update admins" ON website_admins;
DROP POLICY IF EXISTS "Superadmin can delete admins" ON website_admins;
DROP POLICY IF EXISTS "website_admins_select" ON website_admins;
DROP POLICY IF EXISTS "website_admins_insert" ON website_admins;
DROP POLICY IF EXISTS "website_admins_update" ON website_admins;
DROP POLICY IF EXISTS "website_admins_delete" ON website_admins;

-- Simple non-recursive: authenticated user can see their own admin row
CREATE POLICY "Admin can view own record"
  ON website_admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- For insert/update/delete: use a security definer function to avoid recursion
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM website_admins WHERE id = auth.uid() AND role = 'superadmin'
  );
$$;

CREATE POLICY "Superadmin can insert admin"
  ON website_admins FOR INSERT
  TO authenticated
  WITH CHECK (is_superadmin());

CREATE POLICY "Superadmin can update admin"
  ON website_admins FOR UPDATE
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

CREATE POLICY "Superadmin can delete admin"
  ON website_admins FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- ============================================================
-- FIX: CMS table policies also use security definer function
-- ============================================================

-- cms_leaders
DROP POLICY IF EXISTS "Admins can insert leaders" ON cms_leaders;
DROP POLICY IF EXISTS "Admins can update leaders" ON cms_leaders;
DROP POLICY IF EXISTS "Admins can delete leaders" ON cms_leaders;

CREATE POLICY "Admins can insert leaders"
  ON cms_leaders FOR INSERT
  TO authenticated
  WITH CHECK (is_superadmin() OR EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can update leaders"
  ON cms_leaders FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can delete leaders"
  ON cms_leaders FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- leadership_videos
DROP POLICY IF EXISTS "Admins can insert leadership videos" ON leadership_videos;
DROP POLICY IF EXISTS "Admins can update leadership videos" ON leadership_videos;
DROP POLICY IF EXISTS "Admins can delete leadership videos" ON leadership_videos;

CREATE POLICY "Admins can insert leadership videos"
  ON leadership_videos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can update leadership videos"
  ON leadership_videos FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can delete leadership videos"
  ON leadership_videos FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- testimonial_videos
DROP POLICY IF EXISTS "Admins can insert testimonial videos" ON testimonial_videos;
DROP POLICY IF EXISTS "Admins can update testimonial videos" ON testimonial_videos;
DROP POLICY IF EXISTS "Admins can delete testimonial videos" ON testimonial_videos;

CREATE POLICY "Admins can insert testimonial videos"
  ON testimonial_videos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can update testimonial videos"
  ON testimonial_videos FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can delete testimonial videos"
  ON testimonial_videos FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- event_videos
DROP POLICY IF EXISTS "Admins can insert event videos" ON event_videos;
DROP POLICY IF EXISTS "Admins can update event videos" ON event_videos;
DROP POLICY IF EXISTS "Admins can delete event videos" ON event_videos;

CREATE POLICY "Admins can insert event videos"
  ON event_videos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can update event videos"
  ON event_videos FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can delete event videos"
  ON event_videos FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- ============================================================
-- ADD: Missing admin SELECT policies
-- ============================================================

-- Admins can read all membership applications
CREATE POLICY "Admins can read membership applications"
  ON membership_applications FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid()));

-- Admins can update membership application status
CREATE POLICY "Admins can update membership applications"
  ON membership_applications FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

-- Admins can read all visitor registrations
CREATE POLICY "Admins can read visitor registrations"
  ON visitor_registrations FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid()));

-- Admins can update visitor registration status
CREATE POLICY "Admins can update visitor registrations"
  ON visitor_registrations FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid()));

-- Profiles: user can insert their own
CREATE POLICY "User can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admins can read all events (not just public ones)
CREATE POLICY "Admins can read all events"
  ON events FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid()));

-- Admins can manage events
CREATE POLICY "Admins can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- Admins can read all blog posts (including unpublished)
CREATE POLICY "Admins can read all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid()));

-- Admins can manage blog posts
CREATE POLICY "Admins can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- Admins can manage testimonials
CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM website_admins WHERE id = auth.uid() AND role IN ('superadmin','editor')));

CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (is_superadmin());
