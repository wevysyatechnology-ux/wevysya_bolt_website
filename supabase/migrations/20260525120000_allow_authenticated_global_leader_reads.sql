DROP POLICY IF EXISTS "Public can view active global leaders" ON global_leaders;

CREATE POLICY "Public can view active global leaders"
  ON global_leaders FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all global leaders"
  ON global_leaders FOR SELECT
  TO authenticated
  USING (true);