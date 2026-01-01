import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Globe, GraduationCap, Heart, Languages, 
  Camera, Save, Mail, MapPin
} from 'lucide-react';
import { toast } from 'sonner';

const INTERESTS = [
  'Technology', 'Music', 'Photography', 'Cooking', 'Travel',
  'Art & Design', 'Sports', 'Reading', 'Social Events', 'Culture',
  'Gaming', 'Movies', 'Entrepreneurship', 'Volunteering'
];

const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    country: currentUser?.country || '',
    campus: currentUser?.campus || '',
    major: currentUser?.major || '',
    year: currentUser?.year || '',
    interests: currentUser?.interests || [],
    languages: currentUser?.languages || [],
  });

  const handleSave = () => {
    updateProfile(formData);
    setEditMode(false);
    toast.success('Profile updated successfully!');
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="border-border/50 shadow-soft overflow-hidden">
        <div className="h-32 bg-gradient-hero" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-large">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="text-3xl">{currentUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{currentUser?.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {currentUser?.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {currentUser?.country}
                    </span>
                  </div>
                </div>
                <Button
                  variant={editMode ? 'outline' : 'default'}
                  onClick={() => editMode ? handleSave() : setEditMode(true)}
                  className={editMode ? '' : 'bg-gradient-primary text-primary-foreground gap-2'}
                >
                  {editMode ? <><Save className="w-4 h-4 mr-2" />Save Changes</> : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bio */}
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Bio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell others about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {currentUser?.bio || 'No bio yet'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Home Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Your home country"
                  />
                ) : (
                  <p className="text-foreground font-medium">{currentUser?.country}</p>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-border/50 shadow-soft md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Campus</Label>
                      <Input
                        value={formData.campus}
                        onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Major</Label>
                      <Input
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-foreground font-medium">{currentUser?.campus}</p>
                    <p className="text-muted-foreground">{currentUser?.major} • {currentUser?.year}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="border-border/50 shadow-soft md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentUser?.languages.map(lang => (
                    <Badge key={lang} variant="secondary" className="px-3 py-1">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interests" className="mt-6">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Your Interests
              </CardTitle>
              <CardDescription>
                {editMode ? 'Click to add or remove interests' : 'Things you enjoy'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => {
                  const isSelected = editMode 
                    ? formData.interests.includes(interest)
                    : currentUser?.interests.includes(interest);
                  
                  if (!editMode && !isSelected) return null;

                  return (
                    <Badge
                      key={interest}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`px-4 py-2 cursor-pointer transition-all
                        ${isSelected 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'}`}
                      onClick={() => editMode && toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your groups and events</p>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Who can see your profile</p>
                </div>
                <Badge variant="secondary">Community Members</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Group Matching</p>
                  <p className="text-sm text-muted-foreground">Preference for group assignments</p>
                </div>
                <Badge variant="secondary">Mixed Countries</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
