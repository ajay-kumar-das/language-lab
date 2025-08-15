import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { ConversationView } from './ConversationView';

const scenarios = [
  'Ordering Food at a Restaurant',
  'Shopping for Clothes',
  'Asking for Directions',
  'Job Interview',
  'Doctor Appointment',
  'Hotel Check-in',
  'Meeting New People',
  'Public Transportation'
];

const languages = [
  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Japanese', 'Korean', 'Chinese', 'Arabic', 'Russian', 'Dutch'
];

export function Practice() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [isInConversation, setIsInConversation] = useState(false);

  const startConversation = () => {
    if (selectedLanguage && selectedScenario) {
      setIsInConversation(true);
    }
  };

  const endConversation = () => {
    setIsInConversation(false);
  };

  if (isInConversation) {
    return (
      <ConversationView
        language={selectedLanguage}
        scenario={selectedScenario}
        onEnd={endConversation}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl">Practice Conversations</h1>
        <p className="text-muted-foreground">Practice speaking with our AI tutor in real-world scenarios</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choose Practice Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
            <Label>Scenario</Label>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger>
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario} value={scenario}>
                    {scenario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={startConversation}
            disabled={!selectedLanguage || !selectedScenario}
            className="w-full"
          >
            Start Conversation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}