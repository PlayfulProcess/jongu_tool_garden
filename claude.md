To dos:
a) Copilot advised me on this Supabase Schema, do you agree?
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true);

-- Public read access (good as-is)
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'thumbnails');

-- More secure upload policy (restrict to authenticated users)
CREATE POLICY "Allow authenticated uploads" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'thumbnails' 
  AND auth.role() = 'authenticated'
);

-- Optional: Allow updates/deletes for authenticated users
CREATE POLICY "Allow authenticated updates" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'thumbnails' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated deletes" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'thumbnails' 
  AND auth.role() = 'authenticated'
);