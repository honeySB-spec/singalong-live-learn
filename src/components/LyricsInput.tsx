import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Music2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface LyricsInputProps {
  onSubmit: (lyrics: string) => void;
  onBack: () => void;
}

const lyricsSchema = z.string()
  .trim()
  .min(10, { message: "Lyrics must be at least 10 characters long" })
  .max(10000, { message: "Lyrics must be less than 10,000 characters" });

const LyricsInput = ({ onSubmit, onBack }: LyricsInputProps) => {
  const [lyrics, setLyrics] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    try {
      const validatedLyrics = lyricsSchema.parse(lyrics);
      
      if (validatedLyrics.split('\n').filter(line => line.trim()).length < 2) {
        setError("Please enter at least 2 lines of lyrics");
        toast.error("Please enter at least 2 lines of lyrics");
        return;
      }

      setError("");
      onSubmit(validatedLyrics);
      toast.success("Lyrics loaded successfully!");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0].message;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handlePaste = () => {
    toast.info("Paste your lyrics into the text area");
  };

  const characterCount = lyrics.length;
  const linesCount = lyrics.split('\n').filter(line => line.trim()).length;

  return (
    <div className="min-h-screen bg-gradient-hero p-6 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-12 h-12 text-primary" />
            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Paste Your Lyrics
          </h2>
          <p className="text-muted-foreground text-lg">
            Copy and paste the song lyrics you want to learn
          </p>
        </div>

        {/* Input Card */}
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border">
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your song lyrics here...&#10;&#10;Each line will be synchronized with the playback.&#10;Include translations if you want multilingual support."
              value={lyrics}
              onChange={(e) => {
                setLyrics(e.target.value);
                if (error) setError("");
              }}
              className="min-h-[300px] text-base resize-none bg-background/50 border-border focus:border-primary transition-colors"
            />

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            {/* Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{characterCount} / 10,000 characters</span>
              <span>•</span>
              <span>{linesCount} lines</span>
            </div>

            {/* Sample lyrics button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const sampleLyrics = `In the silence of the night
When the stars shine bright
I hear your voice calling
Through the winds so free
Dancing with the melody
Lost in harmony`;
                setLyrics(sampleLyrics);
                toast.info("Sample lyrics loaded");
              }}
              className="border-border hover:border-secondary/50"
            >
              Load Sample Lyrics
            </Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="border-border hover:border-primary/50"
          >
            Back
          </Button>

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={lyrics.trim().length < 10}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow-primary hover:shadow-glow-accent transition-all hover:scale-105"
          >
            Start Learning
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Tips */}
        <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/50">
          <h3 className="text-sm font-semibold mb-2 text-foreground">Tips:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Each line should be on a separate line</li>
            <li>• You can add translations or pronunciation guides later</li>
            <li>• Minimum 2 lines required for playback synchronization</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default LyricsInput;
