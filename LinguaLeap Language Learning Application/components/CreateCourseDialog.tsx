import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Star, Crown, Zap, CreditCard } from 'lucide-react';

interface CreateCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (courseData: { language: string; reason: string; tier: 'basic' | 'premium' | 'pro' }) => void;
}

const languages = [
  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Japanese', 'Korean', 'Chinese', 'Arabic', 'Russian', 'Dutch'
];

const reasons = [
  'Travel & Tourism',
  'Business & Career',
  'Academic Studies',
  'Personal Interest',
  'Family & Relationships',
  'Immigration',
  'Cultural Understanding'
];

const pricingTiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29.99,
    icon: Star,
    lessons: 8,
    features: [
      '8 Interactive Lessons',
      'Basic Vocabulary Practice',
      'Simple Conversations',
      'Audio Pronunciation',
      '20% Completion Reward ($5.99)'
    ],
    color: 'bg-gray-500'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    icon: Crown,
    lessons: 12,
    popular: true,
    features: [
      '12 Interactive Lessons',
      'Advanced Vocabulary & Grammar',
      'Real-world Conversations',
      'Native Speaker Audio',
      'Progress Tracking',
      '20% Completion Reward ($9.99)'
    ],
    color: 'bg-blue-500'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 79.99,
    icon: Zap,
    lessons: 16,
    features: [
      '16 Comprehensive Lessons',
      'Professional Vocabulary',
      'Business Conversations',
      'Cultural Context Training',
      'Advanced Pronunciation',
      'Certificate of Completion',
      '20% Completion Reward ($15.99)'
    ],
    color: 'bg-purple-500'
  }
];

export function CreateCourseDialog({ open, onClose, onCreate }: CreateCourseDialogProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'pro'>('premium');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreate = async () => {
    if (selectedLanguage && selectedReason && selectedTier) {
      const selectedTierData = pricingTiers.find(tier => tier.id === selectedTier);
      
      if (!selectedTierData) return;

      setIsProcessing(true);
      
      try {
        await onCreate({ language: selectedLanguage, reason: selectedReason, tier: selectedTier });
        setSelectedLanguage('');
        setSelectedReason('');
        setSelectedTier('premium');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const selectedTierData = pricingTiers.find(tier => tier.id === selectedTier);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Choose your target language, learning purpose, and course tier to create a personalized learning experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target Language</Label>
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
              <Label>Learning Purpose</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Why are you learning?" />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Choose Your Course Tier</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingTiers.map((tier) => {
                const Icon = tier.icon;
                const isSelected = selectedTier === tier.id;
                
                return (
                  <Card 
                    key={tier.id}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    } ${
                      tier.popular ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedTier(tier.id as 'basic' | 'premium' | 'pro')}
                  >
                    <CardHeader className="text-center">
                      {tier.popular && (
                        <Badge className="w-fit mx-auto mb-2 bg-blue-500">
                          Most Popular
                        </Badge>
                      )}
                      <div className="flex justify-center mb-2">
                        <div className={`p-3 rounded-full ${tier.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <div className="text-3xl font-bold">${tier.price}</div>
                      <CardDescription>{tier.lessons} lessons included</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {selectedTierData && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Course Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedLanguage} for {selectedReason} - {selectedTierData.name} Tier
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${selectedTierData.price.toFixed(2)}</div>
                    <div className="text-sm text-green-600">
                      Completion reward: ${(selectedTierData.price * 0.2).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isProcessing && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-2">
                Processing payment and generating your course...
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!selectedLanguage || !selectedReason || isProcessing}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : `Purchase Course - $${selectedTierData?.price.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}