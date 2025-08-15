import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { useUser } from './UserContext';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  score?: number;
  feedback?: string;
}

interface ConversationViewProps {
  language: string;
  scenario: string;
  onEnd: () => void;
}

export function ConversationView({ language, scenario, onEnd }: ConversationViewProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // AI starts the conversation
    const initialMessage: Message = {
      id: '1',
      type: 'ai',
      content: getInitialMessage(scenario, language),
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    
    // Speak the initial message
    setTimeout(() => speakMessage(initialMessage.content), 500);
  }, [scenario, language]);

  const getInitialMessage = (scenario: string, language: string) => {
    const greetings = {
      'Spanish': '¡Hola! Bienvenido. ¿En qué puedo ayudarte hoy?',
      'French': 'Bonjour! Bienvenue. Comment puis-je vous aider aujourd\'hui?',
      'German': 'Hallo! Willkommen. Wie kann ich Ihnen heute helfen?',
      'Italian': 'Ciao! Benvenuto. Come posso aiutarti oggi?'
    };
    return greetings[language] || 'Hello! Welcome. How can I help you today?';
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'Spanish' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Mock speech recognition and AI response
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'Hola, me gustaría reservar una mesa para dos personas.',
        timestamp: new Date(),
        score: Math.floor(Math.random() * 30) + 70,
        feedback: 'Good pronunciation! Try speaking a bit more clearly.'
      };

      setMessages(prev => [...prev, userMessage]);

      // AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: '¡Perfecto! ¿Para qué hora le gustaría la reserva?',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
        speakMessage(aiResponse.content);
        setIsProcessing(false);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Conversation Practice</h1>
          <p className="text-muted-foreground">{scenario} - {language}</p>
        </div>
        <Button variant="outline" onClick={onEnd}>
          <X className="h-4 w-4 mr-2" />
          End Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>L</AvatarFallback>
                </Avatar>
                Lexi - AI Tutor
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.score && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">{message.score}%</Badge>
                        {message.feedback && (
                          <p className="text-xs opacity-75">{message.feedback}</p>
                        )}
                      </div>
                    )}
                    {message.type === 'ai' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakMessage(message.content)}
                        className="mt-2 h-6 px-2"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg mr-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <div className="border-t p-4">
              {!isRecording && !isProcessing && (
                <Button
                  onClick={startRecording}
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <Mic className="h-5 w-5" />
                  Hold to Speak
                </Button>
              )}
              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <MicOff className="h-5 w-5" />
                  Stop Recording
                </Button>
              )}
              {isProcessing && (
                <div className="text-center text-muted-foreground">
                  Processing your speech...
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Session Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Language</p>
                <p className="text-sm">{language}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Scenario</p>
                <p className="text-sm">{scenario}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Messages</p>
                <p className="text-sm">{messages.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Use the vocabulary you've learned</li>
                <li>• Don't worry about making mistakes</li>
                <li>• Try to respond naturally</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}