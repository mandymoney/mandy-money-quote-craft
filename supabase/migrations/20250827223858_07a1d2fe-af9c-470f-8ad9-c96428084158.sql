-- Fix security issue: Remove public read access to quote_attempts table
-- This prevents competitors from accessing sensitive customer contact information

-- Drop the existing public read policy
DROP POLICY IF EXISTS "Allow reading quote attempts" ON public.quote_attempts;

-- Create a new policy that only allows authenticated users to read quote attempts
-- This assumes you have admin users who need to access submitted quotes
CREATE POLICY "Allow authenticated users to read quote attempts"
ON public.quote_attempts
FOR SELECT
TO authenticated
USING (true);

-- Keep the existing public insert policy as it's needed for quote submissions
-- The "Allow public quote attempts" INSERT policy remains unchanged