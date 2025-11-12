import { useState } from "react";
import Hero from "@/components/Hero";
import LyricsInput from "@/components/LyricsInput";
import LyricsViewer from "@/components/LyricsViewer";

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

  if (currentView === "learning") {
    return <LyricsViewer customLyrics={userLyrics} />;
  }

  if (currentView === "input") {
    return <LyricsInput onSubmit={handleLyricsSubmit} onBack={handleBack} />;
  }

  return <Hero onStartLearning={handleStartLearning} />;
};

export default Index;
