
/*
  # Create media storage bucket for image uploads

  ## Changes
  - Creates a public 'media' storage bucket for admin-uploaded images
  - Adds RLS policies so authenticated admins can upload/delete files
  - Public read access for all files (needed to display images on website)
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of all files
CREATE POLICY "Public can view media files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media');

-- Allow authenticated users (admins) to upload
CREATE POLICY "Admins can upload media files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Admins can update media files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media');

-- Allow authenticated users to delete media files
CREATE POLICY "Admins can delete media files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');
