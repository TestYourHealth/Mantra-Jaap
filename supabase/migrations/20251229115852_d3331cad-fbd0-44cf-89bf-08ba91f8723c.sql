-- Create storage bucket for ambient music
INSERT INTO storage.buckets (id, name, public)
VALUES ('ambient-music', 'ambient-music', true);

-- Allow anyone to read ambient music files (public bucket)
CREATE POLICY "Anyone can view ambient music"
ON storage.objects FOR SELECT
USING (bucket_id = 'ambient-music');

-- Allow anyone to upload ambient music (for now, no auth)
CREATE POLICY "Anyone can upload ambient music"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ambient-music');

-- Allow anyone to delete their uploads
CREATE POLICY "Anyone can delete ambient music"
ON storage.objects FOR DELETE
USING (bucket_id = 'ambient-music');

-- Create table to track uploaded music
CREATE TABLE public.ambient_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ambient_tracks ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view ambient tracks"
ON public.ambient_tracks FOR SELECT
USING (true);

-- Public insert access
CREATE POLICY "Anyone can add ambient tracks"
ON public.ambient_tracks FOR INSERT
WITH CHECK (true);

-- Public delete access
CREATE POLICY "Anyone can delete ambient tracks"
ON public.ambient_tracks FOR DELETE
USING (true);