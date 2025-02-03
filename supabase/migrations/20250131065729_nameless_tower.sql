/*
  # Fix storage bucket and policies

  1. Changes
    - Create videos storage bucket if it doesn't exist
    - Update storage policies to allow public access
    - Remove auth-based restrictions
  
  2. Security
    - Allow public access to videos storage bucket
    - Maintain organized storage structure
*/

-- Create or update storage bucket
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('videos', 'videos', true)
    ON CONFLICT (id) DO UPDATE 
    SET public = true;
EXCEPTION
    WHEN others THEN
        NULL;
END $$;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;

-- Create new public storage policies
CREATE POLICY "Allow public access to videos"
ON storage.objects FOR ALL
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');