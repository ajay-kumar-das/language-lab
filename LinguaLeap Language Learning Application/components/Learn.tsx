import React, { useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { VocabularyCard } from './VocabularyCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface VocabularyItem {
  id: string;
  targetLanguage: string;
  english: string;
  nativeTranslation: string;
  contextSentence: string;
  contextTranslation: string;
}

const mockVocabulary: VocabularyItem[] = [
  {
    id: '1',
    targetLanguage: 'Hola',
    english: 'Hello',
    nativeTranslation: 'Hello',
    contextSentence: 'Hola, ¿cómo estás?',
    contextTranslation: 'Hello, how are you?'
  },
  {
    id: '2',
    targetLanguage: 'Gracias',
    english: 'Thank you',
    nativeTranslation: 'Thank you',
    contextSentence: 'Gracias por tu ayuda',
    contextTranslation: 'Thank you for your help'
  },
  {
    id: '3',
    targetLanguage: 'Por favor',
    english: 'Please',
    nativeTranslation: 'Please',
    contextSentence: 'Por favor, ayúdame',
    contextTranslation: 'Please, help me'
  }
];

export function Learn() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [learningType, setLearningType] = useState<'words' | 'sentences'>('words');
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLearning, setIsLearning] = useState(false);

  const handleGenerate = () => {
    if (selectedLanguage && selectedTopic) {
      setVocabularyList(mockVocabulary);
      setCurrentIndex(0);
      setIsLearning(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabularyList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsLearning(false);
      setVocabularyList([]);
    }
  };

  const handleBack = () => {
    setIsLearning(false);
    setVocabularyList([]);
    setCurrentIndex(0);
  };

  if (isLearning && vocabularyList.length > 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={handleBack}>
            ← Back to Selection
          </Button>
        </div>
        <VocabularyCard
          item={vocabularyList[currentIndex]}
          currentIndex={currentIndex}
          totalItems={vocabularyList.length}
          onNext={handleNext}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl">Learn Vocabulary</h1>
        <p className="text-muted-foreground">Choose a language and topic to start learning</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Learning Options</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            selectedTopic={selectedTopic}
            learningType={learningType}
            onLanguageChange={setSelectedLanguage}
            onTopicChange={setSelectedTopic}
            onTypeChange={setLearningType}
          />
          <Button
            onClick={handleGenerate}
            disabled={!selectedLanguage || !selectedTopic}
            className="w-full mt-4"
          >
            Generate {learningType === 'words' ? 'Vocabulary' : 'Sentences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}