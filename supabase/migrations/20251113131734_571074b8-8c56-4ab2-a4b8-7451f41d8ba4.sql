-- Create songs table to store user's song library
CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  lyrics TEXT NOT NULL,
  translation TEXT,
  pronunciation TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on songs table
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for songs table
CREATE POLICY "Users can view their own songs"
  ON public.songs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own songs"
  ON public.songs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own songs"
  ON public.songs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own songs"
  ON public.songs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('song-audio', 'song-audio', false);

-- Storage RLS Policies for audio files
CREATE POLICY "Users can view their own audio files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'song-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own audio files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'song-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own audio files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'song-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own audio files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'song-audio' AND auth.uid()::text = (storage.foldername(name))[1]);