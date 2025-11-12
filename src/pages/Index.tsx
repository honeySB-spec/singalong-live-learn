import { useState } from "react";
import Hero from "@/components/Hero";
import LyricsViewer from "@/components/LyricsViewer";

const Index = () => {
  const [showLearning, setShowLearning] = useState(false);

  if (showLearning) {
    return <LyricsViewer />;
  }

  return <Hero onStartLearning={() => setShowLearning(true)} />;
};

export default Index;
