/*
  # Add role_type column to cms_leaders

  Adds a role_type enum column to identify the 4 fixed Global Leaders Network roles:
  - global_president
  - past_president
  - president_elect
  - council_president

  The homepage will show exactly these 4 slots, one card per role.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_leaders' AND column_name = 'role_type'
  ) THEN
    ALTER TABLE cms_leaders ADD COLUMN role_type text DEFAULT 'global_president';
  END IF;
END $$;
