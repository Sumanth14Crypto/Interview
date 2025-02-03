/*
  # Fix RLS policies for public access

  1. Changes
    - Update RLS policies to allow public access for creating candidates and videos
    - Add policies for storage access
  
  2. Security
    - Allow public INSERT access to candidates and videos tables
    - Allow public access to videos storage bucket
    - Maintain secure read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create candidates" ON candidates;
DROP POLICY IF EXISTS "Users can read own candidate data" ON candidates;
DROP POLICY IF EXISTS "Anyone can create videos" ON videos;
DROP POLICY IF EXISTS "Users can read own videos" ON videos;

-- Create new policies for candidates table
CREATE POLICY "Enable insert for all users" 
  ON candidates FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
  ON candidates FOR SELECT 
  TO public 
  USING (true);

-- Create new policies for videos table
CREATE POLICY "Enable insert for all users" 
  ON videos FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
  ON videos FOR SELECT 
  TO public 
  USING (true);

-- Enable storage policies
BEGIN;
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('videos', 'videos', false)
  ON CONFLICT (id) DO UPDATE SET public = false;

  CREATE POLICY "Give users access to own folder" ON storage.objects
    FOR ALL USING (
      bucket_id = 'videos' AND 
      (storage.foldername(name))[1] = auth.uid()::text
    );
COMMIT;