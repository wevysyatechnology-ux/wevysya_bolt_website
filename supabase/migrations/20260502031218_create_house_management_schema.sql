/*
  # House Management Schema

  Creates a hierarchical location and house management system:
  Country -> State -> Zone -> House -> House Members (President, Secretary, Treasurer)

  1. New Tables
    - `hm_countries` - Country list
    - `hm_states` - States linked to countries
    - `hm_zones` - Zones linked to states
    - `hm_houses` - Houses linked to zones
    - `hm_house_members` - Members (President/Secretary/Treasurer) linked to houses

  2. Security
    - RLS enabled on all tables
    - Public SELECT for all (read-only for visitors)
    - Authenticated users (admins) can INSERT, UPDATE, DELETE
*/

-- Countries
CREATE TABLE IF NOT EXISTS hm_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hm_countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view countries"
  ON hm_countries FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert countries"
  ON hm_countries FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update countries"
  ON hm_countries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete countries"
  ON hm_countries FOR DELETE TO authenticated USING (true);

-- States
CREATE TABLE IF NOT EXISTS hm_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES hm_countries(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hm_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view states"
  ON hm_states FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert states"
  ON hm_states FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update states"
  ON hm_states FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete states"
  ON hm_states FOR DELETE TO authenticated USING (true);

-- Zones
CREATE TABLE IF NOT EXISTS hm_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id uuid NOT NULL REFERENCES hm_states(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hm_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view zones"
  ON hm_zones FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert zones"
  ON hm_zones FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update zones"
  ON hm_zones FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete zones"
  ON hm_zones FOR DELETE TO authenticated USING (true);

-- Houses
CREATE TABLE IF NOT EXISTS hm_houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES hm_zones(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hm_houses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view houses"
  ON hm_houses FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert houses"
  ON hm_houses FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update houses"
  ON hm_houses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete houses"
  ON hm_houses FOR DELETE TO authenticated USING (true);

-- House Members (President, Secretary, Treasurer)
CREATE TABLE IF NOT EXISTS hm_house_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES hm_houses(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'president' CHECK (role IN ('president', 'secretary', 'treasurer')),
  name text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hm_house_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view house members"
  ON hm_house_members FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert house members"
  ON hm_house_members FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update house members"
  ON hm_house_members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete house members"
  ON hm_house_members FOR DELETE TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hm_states_country ON hm_states(country_id);
CREATE INDEX IF NOT EXISTS idx_hm_zones_state ON hm_zones(state_id);
CREATE INDEX IF NOT EXISTS idx_hm_houses_zone ON hm_houses(zone_id);
CREATE INDEX IF NOT EXISTS idx_hm_house_members_house ON hm_house_members(house_id);
