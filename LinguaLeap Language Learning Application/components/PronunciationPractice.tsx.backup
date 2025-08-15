import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Mic, MicOff, RotateCcw } from 'lucide-react';

interface PronunciationPracticeProps {
  targetText: string;
  onComplete: () => void;
}

export function PronunciationPractice({ targetText, onComplete }: PronunciationPracticeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [transcript, setTranscript] = useState('');

  const startRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
    setScore(null);
    setTranscript('');

    // Mock speech recognition
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      
      // Simulate transcript and score
      const mockTranscript = targetText.toLowerCase();
      const mockScore = Math.floor(Math.random() * 30) + 70; // Score between 70-100
      
      setTranscript(mockTranscript);
      setScore(mockScore);
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const retry = () => {
    setHasRecorded(false);
    setScore(null);
    setTranscript('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    return 'Needs Practice';
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Try to pronounce:</p>
          <p className="text-lg">{targetText}</p>
        </div>

        {!hasRecorded && !isRecording && (
          <Button
            onClick={startRecording}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="animate-pulse bg-red-500 rounded-full h-12 w-12 flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Recording... Speak now</p>
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

        {hasRecorded && score !== null && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge className={getScoreColor(score)}>
                  {score}% - {getScoreLabel(score)}
                </Badge>
              </div>
              <Progress value={score} className="w-full" />
            </div>

            {transcript && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">What we heard:</p>
                <p className="italic">"{transcript}"</p>
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