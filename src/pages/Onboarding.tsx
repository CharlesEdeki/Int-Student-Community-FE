import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, GraduationCap, Heart, Settings, ArrowRight, ArrowLeft, 
  Check, Globe, BookOpen, Palette, Music, Camera, Code, 
  Utensils, Plane, Users, Dumbbell
} from 'lucide-react';
import { toast } from 'sonner';

const INTERESTS = [
  { id: 'technology', label: 'Technology', icon: Code },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'cooking', label: 'Cooking', icon: Utensils },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'art', label: 'Art & Design', icon: Palette },
  { id: 'sports', label: 'Sports', icon: Dumbbell },
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'social', label: 'Social Events', icon: Users },
  { id: 'culture', label: 'Culture', icon: Globe },
];

const COUNTRIES = [
  'China', 'India', 'South Korea', 'Saudi Arabia', 'Canada', 
  'Vietnam', 'Taiwan', 'Brazil', 'Mexico', 'Nigeria', 
  'Japan', 'United Kingdom', 'Germany', 'France', 'Other'
];

const LANGUAGES = [
  'English', 'Spanish', 'Mandarin', 'Hindi', 'Arabic', 
  'French', 'Portuguese', 'Japanese', 'Korean', 'German'
];

const Onboarding: React.FC = () => {
  const { onboardingData, setOnboardingData, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const steps = [
    { title: 'Profile', icon: User, description: 'Tell us about yourself' },
    { title: 'Studies', icon: GraduationCap, description: 'Your academic journey' },
    { title: 'Interests', icon: Heart, description: 'What you love' },
    { title: 'Preferences', icon: Settings, description: 'Customize your experience' },
  ];

  const handleNext = () => {
    if (step === 0) {
      if (!onboardingData.profile.country) {
        toast.error('Please select your home country');
        return;
      }
    }
    if (step === 1) {
      if (!onboardingData.study.campus) {
        toast.error('Please select your campus');
        return;
      }
      if (!onboardingData.study.major) {
        toast.error('Please fill in your major');
        return;
      }
    }
    if (step === 2) {
      if (onboardingData.interests.length < 2) {
        toast.error('Please select at least 2 interests');
        return;
      }
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      toast.success('Welcome to Edinburgh In\'t Students Community! 🎉');
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleInterest = (interest: string) => {
    const current = onboardingData.interests;
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    setOnboardingData({ interests: updated });
  };

  const toggleLanguage = (language: string) => {
    const current = onboardingData.preferences.languages;
    const updated = current.includes(language)
      ? current.filter(l => l !== language)
      : [...current, language];
    setOnboardingData({ 
      preferences: { ...onboardingData.preferences, languages: updated } 
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8">
      {/* Progress */}
      <div className="max-w-2xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, idx) => (
            <div key={s.title} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${idx < step ? 'bg-primary text-primary-foreground' : 
                  idx === step ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 
                  'bg-muted text-muted-foreground'}
              `}>
                {idx < step ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              {idx < steps.length - 1 && (
                <div className={`hidden md:block w-20 h-1 mx-2 rounded-full transition-all
                  ${idx < step ? 'bg-primary' : 'bg-muted'}`} 
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="max-w-2xl mx-auto w-full shadow-large border-border/50 animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 0: Profile */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Home Country *</Label>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map(country => (
                    <Badge
                      key={country}
                      variant={onboardingData.profile.country === country ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all hover:shadow-soft
                        ${onboardingData.profile.country === country 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'}`}
                      onClick={() => setOnboardingData({ 
                        profile: { ...onboardingData.profile, country } 
                      })}
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others a bit about yourself..."
                  value={onboardingData.profile.bio}
                  onChange={(e) => setOnboardingData({ 
                    profile: { ...onboardingData.profile, bio: e.target.value } 
                  })}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 1: Studies */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Campus *</Label>
                <div className="flex flex-wrap gap-2">
                  {['Merchiston', 'Craiglockhart', 'Sighthill'].map(campus => (
                    <Badge
                      key={campus}
                      variant={onboardingData.study.campus === campus ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all hover:shadow-soft px-4 py-2
                        ${onboardingData.study.campus === campus 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'}`}
                      onClick={() => setOnboardingData({ 
                        study: { ...onboardingData.study, campus } 
                      })}
                    >
                      {campus}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major / Field of Study *</Label>
                <Input
                  id="major"
                  placeholder="e.g., Computer Science, Business, etc."
                  value={onboardingData.study.major}
                  onChange={(e) => setOnboardingData({ 
                    study: { ...onboardingData.study, major: e.target.value } 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Year of Study</Label>
                <div className="flex flex-wrap gap-2">
                  {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'].map(year => (
                    <Badge
                      key={year}
                      variant={onboardingData.study.year === year ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all hover:shadow-soft
                        ${onboardingData.study.year === year 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'}`}
                      onClick={() => setOnboardingData({ 
                        study: { ...onboardingData.study, year } 
                      })}
                    >
                      {year}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select at least 2 interests to help us match you with like-minded students
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INTERESTS.map(interest => {
                  const isSelected = onboardingData.interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`
                        p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                        ${isSelected 
                          ? 'border-primary bg-primary/10 shadow-soft' 
                          : 'border-border hover:border-primary/50 hover:bg-secondary'}
                      `}
                    >
                      <interest.icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {interest.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Selected: {onboardingData.interests.length} / {INTERESTS.length}
              </p>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Preferred Group Size</Label>
                <div className="flex gap-3">
                  {['Small (3-4)', 'Medium (5-6)', 'Large (7-8)'].map(size => (
                    <Badge
                      key={size}
                      variant={onboardingData.preferences.groupSize === size ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all px-4 py-2
                        ${onboardingData.preferences.groupSize === size 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'}`}
                      onClick={() => setOnboardingData({ 
                        preferences: { ...onboardingData.preferences, groupSize: size } 
                      })}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Matching Preference</Label>
                <div className="flex flex-wrap gap-3">
                  {['Same Country', 'Different Countries', 'No Preference'].map(pref => (
                    <Badge
                      key={pref}
                      variant={onboardingData.preferences.matchingPreference === pref ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all px-4 py-2
                        ${onboardingData.preferences.matchingPreference === pref 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'}`}
                      onClick={() => setOnboardingData({ 
                        preferences: { ...onboardingData.preferences, matchingPreference: pref } 
                      })}
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Languages You Speak</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <Badge
                      key={lang}
                      variant={onboardingData.preferences.languages.includes(lang) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all
                        ${onboardingData.preferences.languages.includes(lang) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'}`}
                      onClick={() => toggleLanguage(lang)}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="gap-2 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            >
              {step === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
