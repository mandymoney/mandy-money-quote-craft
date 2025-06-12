
-- Create the quote-pdfs storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-pdfs', 'quote-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the quote-pdfs bucket to allow anonymous uploads
-- Policy to allow anyone to upload PDFs (INSERT)
CREATE POLICY "Allow anonymous uploads to quote-pdfs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'quote-pdfs');

-- Policy to allow anyone to view PDFs (SELECT)
CREATE POLICY "Allow public access to quote-pdfs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'quote-pdfs');

-- Policy to allow updates to existing files
CREATE POLICY "Allow updates to quote-pdfs"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'quote-pdfs');
