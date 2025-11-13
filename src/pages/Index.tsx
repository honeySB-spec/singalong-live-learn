import { useState } from "react";
import Hero from "@/components/Hero";
import LyricsInput from "@/components/LyricsInput";
import LyricsViewer from "@/components/LyricsViewer";
import { ThemeToggle } from "@/components/ThemeToggle";

type ViewState = "hero" | "input" | "learning";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewState>("hero");
  const [userLyrics, setUserLyrics] = useState("");

  const handleStartLearning = () => {
    setCurrentView("input");
  };

  const handleLyricsSubmit = (lyrics: string) => {
    setUserLyrics(lyrics);
    setCurrentView("learning");
  };

  const handleBack = () => {
    setCurrentView("hero");
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {currentView === "learning" && <LyricsViewer customLyrics={userLyrics} />}
      {currentView === "input" && <LyricsInput onSubmit={handleLyricsSubmit} onBack={handleBack} />}
      {currentView === "hero" && <Hero onStartLearning={handleStartLearning} />}
    </div>
  );
};

export default Index;
