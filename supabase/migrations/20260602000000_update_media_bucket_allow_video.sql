/*
  # Update media storage bucket to allow video uploads

  ## Changes
  - Adds video MIME types (mp4, webm, quicktime, avi) to the allowed list
  - Increases file size limit to 500 MB to accommodate video files
*/

UPDATE storage.buckets
SET
  file_size_limit = 524288000, -- 500 MB
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo'
  ]
WHERE id = 'media';
