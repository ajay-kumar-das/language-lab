import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUser } from "./UserContext"; // Keep using UserContext for now as it has the language preferences
import { toast } from "sonner@2.0.3";

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Japanese",
  "Korean",
  "Chinese",
  "Arabic",
  "Russian",
  "Dutch",
];

export function Profile() {
  const { user, updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl">Profile Settings</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Customize your learning experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Language Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="native-language">
              Native Language
            </Label>
            <Select
              value={user.nativeLanguage}
              onValueChange={(value) =>
                updateUser({ nativeLanguage: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
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
            <Label htmlFor="app-language">App Language</Label>
            <Select
              value={user.appLanguage}
              onValueChange={(value) =>
                updateUser({ appLanguage: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
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
            <Label htmlFor="preferred-voice">
              Preferred Voice
            </Label>
            <Select
              value={user.preferredVoice}
              onValueChange={(value: "male" | "female") =>
                updateUser({ preferredVoice: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full touch-target" 
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <p className="text-sm text-muted-foreground">
              {user.name}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Learning Progress</Label>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Daily Streak</p>
                <p className="font-medium">{user.dailyStreak} days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Words Learned</p>
                <p className="font-medium">{user.wordsLearned}</p>
              </div>
              <div>
                <p className="text-muted-foreground">XP Points</p>
                <p className="font-medium">{user.xpPoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Completed Courses</p>
                <p className="font-medium">{user.completedCourses.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
