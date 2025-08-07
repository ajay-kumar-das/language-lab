import React from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface LanguageSelectorProps {
  selectedLanguage: string;
  selectedTopic: string;
  learningType: 'words' | 'sentences';
  onLanguageChange: (language: string) => void;
  onTopicChange: (topic: string) => void;
  onTypeChange: (type: 'words' | 'sentences') => void;
}

const languages = [
  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Japanese', 'Korean', 'Chinese', 'Arabic', 'Russian', 'Dutch'
];

const topics = [
  'Greetings', 'Food & Dining', 'Travel & Transportation', 'Family & Relationships',
  'Work & Business', 'Shopping', 'Health & Medical', 'Education', 'Entertainment',
  'Weather', 'Colors & Numbers', 'Time & Dates'
];

export function LanguageSelector({
  selectedLanguage,
  selectedTopic,
  learningType,
  onLanguageChange,
  onTopicChange,
  onTypeChange
}: LanguageSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Target Language</Label>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Topic</Label>
        <Select value={selectedTopic} onValueChange={onTopicChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Learning Type</Label>
        <RadioGroup value={learningType} onValueChange={(value: string) => onTypeChange(value as 'words' | 'sentences')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="words" id="words" />
            <Label htmlFor="words">Words</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sentences" id="sentences" />
            <Label htmlFor="sentences">Sentences</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}