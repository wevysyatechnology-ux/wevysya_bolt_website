/*
  # WeVysya Platform Database Schema

  ## Tables Created
  
  1. **profiles** - Extended user profiles for members
     - `id` (uuid, references auth.users)
     - `full_name` (text)
     - `business_name` (text)
     - `business_category` (text)
     - `city` (text)
     - `state` (text)
     - `country` (text, default 'India')
     - `phone` (text)
     - `bio` (text)
     - `photo_url` (text)
     - `membership_type` (text: 'regular' or 'privileged')
     - `membership_status` (text: 'pending', 'active', 'expired')
     - `approved_at` (timestamptz)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  2. **events** - Community events and meetings
     - `id` (uuid, primary key)
     - `title` (text)
     - `description` (text)
     - `event_type` (text: 'meeting', 'national', 'visitor_day')
     - `start_date` (timestamptz)
     - `end_date` (timestamptz)
     - `location` (text)
     - `city` (text)
     - `max_attendees` (integer)
     - `image_url` (text)
     - `created_at` (timestamptz)

  3. **event_registrations** - Event RSVPs
     - `id` (uuid, primary key)
     - `event_id` (uuid, references events)
     - `user_id` (uuid, references auth.users, nullable for visitors)
     - `visitor_name` (text, for non-members)
     - `visitor_email` (text, for non-members)
     - `visitor_phone` (text, for non-members)
     - `status` (text: 'registered', 'attended', 'cancelled')
     - `created_at` (timestamptz)

  4. **testimonials** - Member testimonials and success stories
     - `id` (uuid, primary key)
     - `member_name` (text)
     - `member_business` (text)
     - `member_photo_url` (text)
     - `content` (text)
     - `rating` (integer)
     - `featured` (boolean, default false)
     - `created_at` (timestamptz)

  5. **blog_posts** - Articles and resources
     - `id` (uuid, primary key)
     - `title` (text)
     - `slug` (text, unique)
     - `content` (text)
     - `excerpt` (text)
     - `author_id` (uuid, references auth.users)
     - `category` (text: 'success_story', 'business_tip', 'recipe', 'podcast')
     - `image_url` (text)
     - `published` (boolean, default false)
     - `published_at` (timestamptz)
     - `created_at` (timestamptz)

  6. **membership_applications** - New member applications
     - `id` (uuid, primary key)
     - `full_name` (text)
     - `email` (text)
     - `phone` (text)
     - `business_name` (text)
     - `business_category` (text)
     - `city` (text)
     - `state` (text)
     - `membership_type` (text: 'regular' or 'privileged')
     - `why_join` (text)
     - `is_arya_vysya` (boolean)
     - `no_criminal_background` (boolean)
     - `status` (text: 'pending', 'approved', 'rejected')
     - `created_at` (timestamptz)

  7. **visitor_registrations** - Visitor day registrations
     - `id` (uuid, primary key)
     - `full_name` (text)
     - `email` (text)
     - `phone` (text)
     - `business_name` (text)
     - `city` (text)
     - `preferred_date` (timestamptz)
     - `status` (text: 'pending', 'approved', 'attended')
     - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users and public read access where appropriate
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  business_name text,
  business_category text,
  city text,
  state text,
  country text DEFAULT 'India',
  phone text,
  bio text,
  photo_url text,
  membership_type text CHECK (membership_type IN ('regular', 'privileged')),
  membership_status text DEFAULT 'pending' CHECK (membership_status IN ('pending', 'active', 'expired')),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (membership_status = 'active');

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('meeting', 'national', 'visitor_day')),
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  city text,
  max_attendees integer,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  TO public
  USING (true);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_name text,
  visitor_email text,
  visitor_phone text,
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Visitors can register for events"
  ON event_registrations FOR INSERT
  TO public
  WITH CHECK (user_id IS NULL AND visitor_email IS NOT NULL);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name text NOT NULL,
  member_business text,
  member_photo_url text,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are viewable by everyone"
  ON testimonials FOR SELECT
  TO public
  USING (true);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text CHECK (category IN ('success_story', 'business_tip', 'recipe', 'podcast')),
  image_url text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

-- Create membership_applications table
CREATE TABLE IF NOT EXISTS membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_name text NOT NULL,
  business_category text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  membership_type text NOT NULL CHECK (membership_type IN ('regular', 'privileged')),
  why_join text NOT NULL,
  is_arya_vysya boolean NOT NULL,
  no_criminal_background boolean NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit membership application"
  ON membership_applications FOR INSERT
  TO public
  WITH CHECK (true);

-- Create visitor_registrations table
CREATE TABLE IF NOT EXISTS visitor_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_name text,
  city text NOT NULL,
  preferred_date timestamptz NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'attended')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visitor_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register as visitor"
  ON visitor_registrations FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_membership_status ON profiles(membership_status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
