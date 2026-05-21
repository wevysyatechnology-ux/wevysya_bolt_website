
/*
  # Fix website_admins SELECT policy

  ## Problem
  Two conflicting SELECT policies exist on website_admins:
  1. "Website admins can read admin list" - uses recursive subquery (causes infinite loop)
  2. "Admin can view own record" - correct but may conflict

  Also duplicate INSERT/UPDATE/DELETE policies exist from previous migrations.

  ## Fix
  Drop ALL existing policies and recreate clean ones with no recursion.
*/

-- Drop every policy on website_admins
DROP POLICY IF EXISTS "Website admins can read admin list" ON website_admins;
DROP POLICY IF EXISTS "Superadmins can insert admins" ON website_admins;
DROP POLICY IF EXISTS "Superadmins can update admin roles" ON website_admins;
DROP POLICY IF EXISTS "Superadmins can delete admins" ON website_admins;
DROP POLICY IF EXISTS "Admin can view own record" ON website_admins;
DROP POLICY IF EXISTS "Superadmin can insert admin" ON website_admins;
DROP POLICY IF EXISTS "Superadmin can update admin" ON website_admins;
DROP POLICY IF EXISTS "Superadmin can delete admin" ON website_admins;

-- Simple non-recursive SELECT: user can only see their own row
CREATE POLICY "Admin can view own record"
  ON website_admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- INSERT: only superadmin can add new admins (uses security definer function, no recursion)
CREATE POLICY "Superadmin can insert admin"
  ON website_admins FOR INSERT
  TO authenticated
  WITH CHECK (is_superadmin());

-- UPDATE: only superadmin
CREATE POLICY "Superadmin can update admin"
  ON website_admins FOR UPDATE
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

-- DELETE: only superadmin
CREATE POLICY "Superadmin can delete admin"
  ON website_admins FOR DELETE
  TO authenticated
  USING (is_superadmin());
