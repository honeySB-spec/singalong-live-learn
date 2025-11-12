import { Music2, Mic2, Languages, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = ({ onStartLearning }: { onStartLearning: () => void }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Music2 className="w-16 h-16 text-primary animate-pulse-glow" />
              <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
            LATA
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            AI-Powered Music Learning Platform
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Master your favorite songs with real-time synchronized lyrics, pronunciation coaching, and instant translations. Turn passive listening into active, enjoyable learning.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-glow-primary">
              <Mic2 className="w-8 h-8 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Pronunciation Coach</h3>
              <p className="text-sm text-muted-foreground">Perfect your pronunciation with AI-powered feedback</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-secondary/50 transition-all hover:shadow-glow-primary">
              <Languages className="w-8 h-8 text-secondary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Smart Translation</h3>
              <p className="text-sm text-muted-foreground">Understand lyrics in any language instantly</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-accent/50 transition-all hover:shadow-glow-accent">
              <Music2 className="w-8 h-8 text-accent mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Real-Time Sync</h3>
              <p className="text-sm text-muted-foreground">Follow along with perfectly timed lyrics</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Button 
              onClick={onStartLearning}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-glow-primary hover:shadow-glow-accent transition-all hover:scale-105"
            >
              Start Learning Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
