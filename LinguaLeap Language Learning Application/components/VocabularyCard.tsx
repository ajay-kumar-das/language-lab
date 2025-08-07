import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Volume2, Eye, EyeOff } from 'lucide-react';
import { PronunciationPractice } from './PronunciationPractice';
import { useUser } from './UserContext';

interface VocabularyItem {
  id: string;
  targetLanguage: string;
  english: string;
  nativeTranslation: string;
  contextSentence: string;
  contextTranslation: string;
}

interface VocabularyCardProps {
  item: VocabularyItem;
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
}

export function VocabularyCard({ item, currentIndex, totalItems, onNext }: VocabularyCardProps) {
  const { user } = useUser();
  const [showEnglish, setShowEnglish] = useState(false);
  const [showNative, setShowNative] = useState(false);
  const [showPractice, setShowPractice] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES'; // This would be dynamic based on selected language
      utterance.rate = 0.8;
      
      // Simple voice selection based on user preference
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => 
        v.lang.includes('es') && 
        (user.preferredVoice === 'female' ? v.name.includes('Female') : v.name.includes('Male'))
      );
      if (voice) utterance.voice = voice;
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">
          {currentIndex + 1} of {totalItems}
        </Badge>
        <Button variant="outline" onClick={onNext}>
          {currentIndex + 1 === totalItems ? 'Finish' : 'Next →'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {item.targetLanguage}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => speakText(item.targetLanguage)}
              className="flex items-center gap-2"
            >
              <Volume2 className="h-5 w-5" />
              Listen
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span>English Translation</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEnglish(!showEnglish)}
              >
                {showEnglish ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {showEnglish && (
              <p className="text-center p-4 bg-muted rounded-lg">{item.english}</p>
            )}

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span>Native Translation</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNative(!showNative)}
              >
                {showNative ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {showNative && (
              <p className="text-center p-4 bg-muted rounded-lg">{item.nativeTranslation}</p>
            )}
          </div>

          <div className="border-t pt-4">
            <h4>Context Example:</h4>
            <div className="space-y-2">
              <p className="italic">{item.contextSentence}</p>
              <p className="text-sm text-muted-foreground">{item.contextTranslation}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPractice(!showPractice)}
              className="w-full"
            >
              {showPractice ? 'Hide' : 'Practice'} Pronunciation
            </Button>
            {showPractice && (
              <div className="mt-4">
                <PronunciationPractice 
                  targetText={item.targetLanguage}
                  onComplete={() => setShowPractice(false)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}