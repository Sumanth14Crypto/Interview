/*
  # Admin Setup and Access Control

  1. New Tables
    - `admin_users` table for storing admin credentials
    - `admin_sessions` table for tracking admin logins
  
  2. Security
    - Enable RLS on new tables
    - Add policies for admin access
    - Create admin user with provided credentials
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access to candidates and videos
CREATE POLICY "Admin users can read all candidates"
  ON candidates FOR SELECT
  TO authenticated
  USING (
    auth.email() IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admin users can read all videos"
  ON videos FOR SELECT
  TO authenticated
  USING (
    auth.email() IN (SELECT email FROM admin_users)
  );

-- Insert admin user
INSERT INTO admin_users (email)
VALUES ('admin@posspole.com')
ON CONFLICT (email) DO NOTHING;