import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, History, MessageCircle, Globe, GraduationCap, 
  UserPlus, Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const Connections: React.FC = () => {
  const { users, groups, currentUser, getUserById } = useApp();

  // Get past groups (groups that have expired or current user is member of)
  const myGroups = groups.filter(g => g.members.includes(currentUser?.id || ''));
  
  // Get connections (other users from your groups)
  const connectionIds = new Set<string>();
  myGroups.forEach(group => {
    group.members.forEach(memberId => {
      if (memberId !== currentUser?.id) {
        connectionIds.add(memberId);
      }
    });
  });
  const connections = Array.from(connectionIds).map(id => getUserById(id)).filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Network</h1>
        <p className="text-muted-foreground">Your connections and past groups</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{connections.length}</p>
                <p className="text-sm text-muted-foreground">Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <History className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{myGroups.length}</p>
                <p className="text-sm text-muted-foreground">Groups Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(connections.map(c => c?.country)).size}
                </p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList>
          <TabsTrigger value="connections" className="gap-2">
            <Users className="w-4 h-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <History className="w-4 h-4" />
            My Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-6">
          {connections.length === 0 ? (
            <Card className="border-border/50 shadow-soft">
              <CardContent className="py-12 text-center">
                <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No connections yet</p>
                <p className="text-muted-foreground">Join groups to meet new people!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map(connection => (
                <Card key={connection?.id} className="border-border/50 shadow-soft hover:shadow-medium transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={connection?.avatar} alt={connection?.name} />
                          <AvatarFallback>{connection?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {connection?.isOnline && (
                          <span className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{connection?.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Globe className="w-3 h-3" />
                          <span>{connection?.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="w-3 h-3" />
                          <span>{connection?.major}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {connection?.interests.slice(0, 3).map(interest => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <div className="space-y-4">
            {myGroups.map(group => {
              const members = group.members.map(id => getUserById(id)).filter(Boolean);
              const isActive = new Date(group.expiresAt) > new Date();

              return (
                <Card key={group.id} className="border-border/50 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                          ${isActive ? 'bg-gradient-primary' : 'bg-muted'}`}>
                          <Users className={`w-6 h-6 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{group.name}</h3>
                            <Badge variant={isActive ? 'default' : 'secondary'}>
                              {isActive ? 'Active' : 'Completed'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {members.slice(0, 4).map(member => (
                            <Avatar key={member?.id} className="w-8 h-8 border-2 border-background">
                              <AvatarImage src={member?.avatar} alt={member?.name} />
                              <AvatarFallback>{member?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(group.createdAt), 'MMM yyyy')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Connections;
