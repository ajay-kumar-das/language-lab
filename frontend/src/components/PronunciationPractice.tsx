import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Mic, 
  MicOff, 
  RotateCcw, 
  Volume2, 
  Wifi, 
  WifiOff, 
  Settings,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface PronunciationPracticeProps {
  targetText: string;
  targetLanguage?: string;
  onComplete: () => void;
  onScoreUpdate?: (score: number) => void;
  showRealTimeTranscription?: boolean;
  enableProviderSelection?: boolean;
}

export function PronunciationPractice({ 
  targetText, 
  targetLanguage = "en-US",
  onComplete,
  onScoreUpdate,
  showRealTimeTranscription = true,
  enableProviderSelection = false
}: PronunciationPracticeProps) {
  const [hasAttempted, setHasAttempted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  // Mock Web Speech API integration for now - will be replaced with real implementation
  const startRecording = () => {
    setIsListening(true);
    setHasAttempted(false);
    setScore(null);
    setTranscript("");
    setError(null);

    // Simulate real-time transcription
    let mockTranscript = "";
    const words = targetText.split(" ");
    let wordIndex = 0;

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        mockTranscript += (wordIndex > 0 ? " " : "") + words[wordIndex];
        setCurrentTranscript(mockTranscript);
        setVolumeLevel(Math.random() * 100);
        wordIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsListening(false);
          setHasAttempted(true);
          setTranscript(mockTranscript);
          
          // Calculate mock score
          const mockScore = Math.floor(Math.random() * 30) + 70;
          const mockConfidence = Math.random() * 0.3 + 0.7;
          
          setScore(mockScore);
          setConfidence(mockConfidence);
          setVolumeLevel(0);
          onScoreUpdate?.(mockScore);
        }, 500);
      }
    }, 800);
  };

  const stopRecording = () => {
    setIsListening(false);
  };

  const retry = () => {
    setHasAttempted(false);
    setScore(null);
    setTranscript("");
    setCurrentTranscript("");
    setError(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    return "Needs Practice";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pronunciation Practice</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Wifi className="h-3 w-3 text-green-500" />
              <span>Web Speech</span>
            </div>
            {enableProviderSelection && (
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Try to pronounce:</p>
          <p className="text-lg font-medium bg-muted p-3 rounded-lg">
            {targetText}
          </p>
        </div>

        {showRealTimeTranscription && isListening && currentTranscript && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border">
            <p className="text-sm text-muted-foreground">Live transcription:</p>
            <p className="text-sm italic">{currentTranscript}</p>
          </div>
        )}

        {isListening && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span className="text-sm">Volume: {Math.round(volumeLevel)}%</span>
            </div>
            <Progress value={volumeLevel} className="h-2" />
          </div>
        )}

        {!hasAttempted && !isListening && (
          <Button
            onClick={startRecording}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}

        {isListening && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="animate-pulse bg-red-500 rounded-full h-16 w-16 flex items-center justify-center">
                <Mic className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Listening... Speak clearly into your microphone
            </p>
            <Button
              variant="outline"
              onClick={stopRecording}
              className="flex items-center gap-2"
            >
              <MicOff className="h-4 w-4" />
              Stop Recording
            </Button>
          </div>
        )}

        {hasAttempted && score !== null && (
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Badge className={`${getScoreColor(score)} text-white`}>
                  {score}% - {getScoreLabel(score)}
                </Badge>
                {score >= 90 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
              <Progress value={score} className="w-full" />
            </div>

            {transcript && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">What we heard:</p>
                <p className="italic">{transcript}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={retry}
                className="flex-1 flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={onComplete} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
