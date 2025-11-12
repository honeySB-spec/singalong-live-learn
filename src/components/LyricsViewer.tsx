import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface LyricLine {
  time: number;
  text: string;
  translation: string;
  pronunciation: string;
}

const sampleLyrics: LyricLine[] = [
  { time: 0, text: "In the silence of the night", translation: "रात की खामोशी में", pronunciation: "in thə ˈsaɪləns əv ðə naɪt" },
  { time: 3, text: "When the stars shine bright", translation: "जब तारे चमकते हैं", pronunciation: "wɛn ðə stɑrz ʃaɪn braɪt" },
  { time: 6, text: "I hear your voice calling", translation: "मैं तुम्हारी आवाज़ सुनता हूँ", pronunciation: "aɪ hɪr jʊr vɔɪs ˈkɔlɪŋ" },
  { time: 9, text: "Through the winds so free", translation: "इतनी मुक्त हवाओं के बीच", pronunciation: "θru ðə wɪndz soʊ fri" },
  { time: 12, text: "Dancing with the melody", translation: "धुन के साथ नाचते हुए", pronunciation: "ˈdænsɪŋ wɪð ðə ˈmɛlədi" },
  { time: 15, text: "Lost in harmony", translation: "सामंजस्य में खोया हुआ", pronunciation: "lɔst ɪn ˈhɑrməni" },
];

const LyricsViewer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showPronunciation, setShowPronunciation] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 18) {
            setIsPlaying(false);
            return 18;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getCurrentLineIndex = () => {
    for (let i = sampleLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= sampleLyrics[i].time) {
        return i;
      }
    }
    return -1;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.success("Playback started");
    }
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    toast.info("Reset to beginning");
  };

  const currentLineIndex = getCurrentLineIndex();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Interactive Learning
          </h2>
          <p className="text-muted-foreground">
            Follow along and master every word
          </p>
        </div>

        {/* Player Controls */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border animate-slide-up">
          <div className="space-y-6">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleReset}
                variant="outline"
                size="icon"
                className="rounded-full border-border hover:border-primary/50"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handlePlayPause}
                size="icon"
                className="w-16 h-16 rounded-full bg-gradient-primary hover:opacity-90 shadow-glow-primary"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                onValueChange={(value) => setCurrentTime(value[0])}
                max={18}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currentTime.toFixed(1)}s</span>
                <span>18.0s</span>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="flex justify-center gap-4">
              <Button
                variant={showTranslation ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
                className={showTranslation ? "bg-secondary" : ""}
              >
                Translation
              </Button>
              <Button
                variant={showPronunciation ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPronunciation(!showPronunciation)}
                className={showPronunciation ? "bg-accent" : ""}
              >
                Pronunciation
              </Button>
            </div>
          </div>
        </Card>

        {/* Lyrics Display */}
        <div className="space-y-4">
          {sampleLyrics.map((line, index) => {
            const isActive = index === currentLineIndex;
            const isPast = index < currentLineIndex;
            
            return (
              <Card
                key={index}
                className={`p-6 transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-secondary border-primary shadow-glow-primary scale-105"
                    : isPast
                    ? "bg-card/30 border-border opacity-50"
                    : "bg-card/50 border-border"
                }`}
              >
                <div className="space-y-2">
                  <p
                    className={`text-xl font-medium transition-all ${
                      isActive ? "text-foreground" : "text-foreground/70"
                    }`}
                  >
                    {line.text}
                  </p>
                  
                  {showTranslation && (
                    <p className="text-secondary text-sm">
                      {line.translation}
                    </p>
                  )}
                  
                  {showPronunciation && (
                    <p className="text-muted-foreground text-xs font-mono">
                      [{line.pronunciation}]
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LyricsViewer;
