import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Music, Upload } from "lucide-react";

interface SongUploadProps {
  onSuccess: (songId: string) => void;
  onCancel: () => void;
  initialLyrics?: string;
}

export const SongUpload = ({ onSuccess, onCancel, initialLyrics = "" }: SongUploadProps) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState(initialLyrics);
  const [translation, setTranslation] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("audio/")) {
        toast.error("Please select an audio file");
        return;
      }
      // Check file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let audioUrl = null;

      // Upload audio file if provided
      if (audioFile) {
        const fileExt = audioFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("song-audio")
          .upload(fileName, audioFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("song-audio")
          .getPublicUrl(fileName);

        audioUrl = publicUrl;
      }

      // Insert song into database
      const { data: song, error: insertError } = await supabase
        .from("songs" as any)
        .insert({
          user_id: user.id,
          title,
          artist,
          lyrics,
          translation: translation || null,
          pronunciation: pronunciation || null,
          audio_url: audioUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!song) throw new Error("Failed to create song");

      toast.success("Song saved successfully!");
      onSuccess(song.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to save song");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            Save to Library
          </CardTitle>
          <CardDescription>
            Save your song with audio, lyrics, translations, and pronunciation guides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Song Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter song title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  placeholder="Enter artist name"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio">Audio File (MP3, WAV, etc.)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="audio"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {audioFile && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    {audioFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lyrics">Lyrics *</Label>
              <Textarea
                id="lyrics"
                placeholder="Enter song lyrics..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                required
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="translation">Translation</Label>
              <Textarea
                id="translation"
                placeholder="Enter translation..."
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pronunciation">Pronunciation Guide</Label>
              <Textarea
                id="pronunciation"
                placeholder="Enter pronunciation guide..."
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Song"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
