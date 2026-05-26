-- Fix global_leaders RLS: ensure authenticated admins can INSERT, UPDATE, DELETE
-- regardless of is_active value. The SELECT policies already exist; this migration
-- adds (or recreates) the write policies that may be missing from the live database.

DROP POLICY IF EXISTS "Authenticated users can insert global leaders" ON global_leaders;
DROP POLICY IF EXISTS "Authenticated users can update global leaders" ON global_leaders;
DROP POLICY IF EXISTS "Authenticated users can delete global leaders" ON global_leaders;

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
