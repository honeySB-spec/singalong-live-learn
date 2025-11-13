import { useState } from "react";
import Hero from "@/components/Hero";
import LyricsInput from "@/components/LyricsInput";
import LyricsViewer from "@/components/LyricsViewer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthForm } from "@/components/AuthForm";
import { SongLibrary } from "@/components/SongLibrary";
import { SongUpload } from "@/components/SongUpload";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Save, Library } from "lucide-react";

type ViewState = "hero" | "input" | "learning" | "library" | "upload";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>("hero");
  const [userLyrics, setUserLyrics] = useState("");
  const [selectedSong, setSelectedSong] = useState<any>(null);

  const handleStartLearning = () => {
    setCurrentView("input");
  };

  const handleLyricsSubmit = (lyrics: string) => {
    setUserLyrics(lyrics);
    setCurrentView("learning");
  };

  const handleBack = () => {
    setCurrentView("hero");
    setSelectedSong(null);
  };

  const handleSaveToLibrary = () => {
    setCurrentView("upload");
  };

  const handleViewLibrary = () => {
    setCurrentView("library");
  };

  const handleSongSaved = () => {
    setCurrentView("library");
  };

  const handleViewSong = (song: any) => {
    setSelectedSong(song);
    setUserLyrics(song.lyrics);
    setCurrentView("learning");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user && (currentView === "library" || currentView === "upload")) {
    return <AuthForm onSuccess={() => setCurrentView("library")} />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {user && currentView !== "library" && currentView !== "upload" && (
          <Button variant="outline" size="icon" onClick={handleViewLibrary}>
            <Library className="h-5 w-5" />
          </Button>
        )}
        {currentView === "learning" && user && (
          <Button variant="outline" size="icon" onClick={handleSaveToLibrary}>
            <Save className="h-5 w-5" />
          </Button>
        )}
        <ThemeToggle />
      </div>
      
      {currentView === "learning" && <LyricsViewer customLyrics={userLyrics} />}
      {currentView === "input" && <LyricsInput onSubmit={handleLyricsSubmit} onBack={handleBack} />}
      {currentView === "hero" && <Hero onStartLearning={handleStartLearning} />}
      {currentView === "library" && user && (
        <SongLibrary
          onNewSong={() => setCurrentView("upload")}
          onViewSong={handleViewSong}
          onSignOut={() => {
            signOut();
            setCurrentView("hero");
          }}
        />
      )}
      {currentView === "upload" && user && (
        <SongUpload
          onSuccess={handleSongSaved}
          onCancel={() => setCurrentView(selectedSong ? "learning" : "library")}
          initialLyrics={userLyrics}
        />
      )}
    </div>
  );
};

export default Index;
