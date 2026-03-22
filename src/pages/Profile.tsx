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

const normalizeInterest = (value: string) => value.trim().toLowerCase();
const formatInterestLabel = (value: string) =>
  value
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

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

  const normalizedCurrentInterests = new Set((currentUser?.interests || []).map(normalizeInterest));
  const normalizedFormInterests = new Set((formData.interests || []).map(normalizeInterest));

  const handleSave = () => {
    updateProfile(formData);
    setEditMode(false);
    toast.success('Profile updated successfully!');
  };

  const toggleInterest = (interest: string) => {
    const normalizedInterest = normalizeInterest(interest);

    setFormData(prev => ({
      ...prev,
      interests: prev.interests.some(item => normalizeInterest(item) === normalizedInterest)
        ? prev.interests.filter(item => normalizeInterest(item) !== normalizedInterest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
...
              <div className="flex flex-wrap gap-2">
                {editMode ? (
                  INTERESTS.map(interest => {
                    const isSelected = normalizedFormInterests.has(normalizeInterest(interest));

                    return (
                      <Badge
                        key={interest}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`px-4 py-2 cursor-pointer transition-all
                          ${isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    );
                  })
                ) : (
                  (currentUser?.interests || []).map(interest => (
                    <Badge
                      key={interest}
                      variant="default"
                      className="px-4 py-2 bg-primary text-primary-foreground"
                    >
                      {formatInterestLabel(interest)}
                    </Badge>
                  ))
                )}
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
