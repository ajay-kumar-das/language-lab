import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  User, 
  Mail, 
  Globe, 
  Settings, 
  Bell,
  Shield,
  Award,
  BookOpen,
  Target,
  Flame,
  Edit3,
  Languages,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useAuthContext } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";
import { userApiService } from "../services/api/userService";
import { useAuthStore } from "../store/authStore";
import { SUPPORTED_LANGUAGES, APP_INTERFACE_LANGUAGES, getLanguageDisplayName, getLanguageByName } from "../constants/languages";

export function Profile() {
  const { user } = useAuthContext();
  const { t, setLanguages, currentLanguage, nativeLanguage } = useLanguage();
  const { updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    nativeLanguage: nativeLanguage,
    appLanguage: currentLanguage
  });

  // Sync form data with language context
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      nativeLanguage: nativeLanguage,
      appLanguage: currentLanguage
    }));
  }, [currentLanguage, nativeLanguage]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Use the proper user API service for authenticated requests
      const updatedUser = await userApiService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        nativeLanguage: formData.nativeLanguage,
        appLanguage: formData.appLanguage
      });

      // Update the auth store with the new user data
      updateUser(updatedUser);

      // Update language context immediately (this will update the entire app)
      setLanguages(formData.appLanguage, formData.nativeLanguage);
      
      // Apply HTML lang attribute
      document.documentElement.lang = getLanguageCode(formData.appLanguage);
      
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error instanceof Error ? error.message : 'Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to current language context values
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      nativeLanguage: nativeLanguage,
      appLanguage: currentLanguage
    });
    setIsEditing(false);
  };

  // Use centralized language configurations
  const nativeLanguages = SUPPORTED_LANGUAGES;
  const appLanguages = APP_INTERFACE_LANGUAGES;

  const getLanguageCode = (language: string): string => {
    const matchingLanguage = getLanguageByName(language);
    return matchingLanguage?.code || 'en';
  };

  return (
    <div className="p-6 space-y-6 page-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-xl">
              <User className="h-8 w-8 text-white" />
            </div>
            {t('profile_settings') || 'Profile Settings'}
          </h1>
          <p className="text-secondary mt-2">{t('manage_account_preferences') || 'Manage your account and preferences'}</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          className="gradient-primary hover:opacity-90"
        >
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Edit3 className="h-4 w-4" />
          )}
          {isSaving ? (t('saving') || 'Saving...') : isEditing ? (t('save_changes') || 'Save Changes') : (t('edit_profile') || 'Edit Profile')}
        </Button>
      </div>

      {/* Personal Information Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            {t('personal_information') || 'Personal Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-secondary mb-2 block">{t('first_name') || 'First Name'}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
                className="content-background border text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-secondary mb-2 block">{t('last_name') || 'Last Name'}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
                className="content-background border text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-secondary mb-2 block">{t('email_address') || 'Email Address'}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className="content-background border text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Preferences Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            {t('language_preferences') || 'Language Preferences'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nativeLanguage" className="text-secondary mb-2 block">{t('native_language') || 'Native Language'}</Label>
              <Select 
                value={formData.nativeLanguage} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, nativeLanguage: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger className="content-background border text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder={t('select_native_language') || 'Select your native language'}>
                    {formData.nativeLanguage && (() => {
                      const selected = nativeLanguages.find(lang => lang.name === formData.nativeLanguage);
                      return selected ? getLanguageDisplayName(selected) : formData.nativeLanguage;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="content-background border">
                  {nativeLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.name} className="text-primary hover:content-background">
                      {getLanguageDisplayName(language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="appLanguage" className="text-secondary mb-2 block">{t('app_language') || 'App Language'}</Label>
              <Select 
                value={formData.appLanguage} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, appLanguage: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger className="content-background border text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder={t('select_app_language') || 'Select app language'}>
                    {formData.appLanguage && (() => {
                      const selected = appLanguages.find(lang => lang.name === formData.appLanguage);
                      return selected ? getLanguageDisplayName(selected) : formData.appLanguage;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="content-background border">
                  {appLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.name} className="text-primary hover:content-background">
                      {getLanguageDisplayName(language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Statistics */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Learning Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-secondary">Words Learned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-secondary">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-secondary">XP Points</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
