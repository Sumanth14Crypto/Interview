/*
  # Initial Schema Setup for Interview System

  1. New Tables
    - `candidates`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `college_name` (text)
      - `date_of_birth` (date)
      - `department` (text)
      - `created_at` (timestamp)
    - `videos`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, foreign key)
      - `question_id` (integer)
      - `video_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read/write their own data
*/

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  college_name text NOT NULL,
  date_of_birth date NOT NULL,
  department text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  question_id integer NOT NULL,
  video_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies for candidates table
CREATE POLICY "Anyone can create candidates"
  ON candidates
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read own candidate data"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for videos table
CREATE POLICY "Anyone can create videos"
  ON videos
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read own videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidates 
      WHERE auth.uid() = candidates.id
    )
  );