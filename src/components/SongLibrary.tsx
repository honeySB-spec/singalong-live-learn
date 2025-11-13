import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Music, Plus, Trash2, Eye } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string | null;
  lyrics: string;
  translation: string | null;
  pronunciation: string | null;
  audio_url: string | null;
  created_at: string;
}

interface SongLibraryProps {
  onNewSong: () => void;
  onViewSong: (song: Song) => void;
  onSignOut: () => void;
}

export const SongLibrary = ({ onNewSong, onViewSong, onSignOut }: SongLibraryProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error: any) {
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (id: string, audioUrl: string | null) => {
    try {
      // Delete audio file if exists
      if (audioUrl) {
        const path = audioUrl.split("/song-audio/")[1];
        if (path) {
          await supabase.storage.from("song-audio").remove([path]);
        }
      }

      // Delete song from database
      const { error } = await supabase.from("songs").delete().eq("id", id);
      if (error) throw error;

      setSongs(songs.filter((s) => s.id !== id));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete song");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Music className="h-8 w-8" />
              My Song Library
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your collection of songs, lyrics, and audio files
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onNewSong}>
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Button>
            <Button variant="outline" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {songs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">Your library is empty</p>
              <Button onClick={onNewSong}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Song
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {songs.map((song) => (
              <Card key={song.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{song.title}</CardTitle>
                  {song.artist && (
                    <CardDescription className="line-clamp-1">{song.artist}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {song.audio_url && (
                      <p className="flex items-center gap-1">
                        <Music className="h-4 w-4" />
                        Audio included
                      </p>
                    )}
                    <p className="line-clamp-2">{song.lyrics.substring(0, 100)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewSong(song)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSong(song.id, song.audio_url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
