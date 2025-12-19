import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, MessageCircle, Calendar, Bell, Clock, 
  Sparkles, ArrowRight, CheckCircle2, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const { currentUser, getCurrentGroup, users, events, notifications, getUserById } = useApp();
  const currentGroup = getCurrentGroup();

  const daysRemaining = currentGroup 
    ? differenceInDays(new Date(currentGroup.expiresAt), new Date()) 
    : 0;

  const upcomingEvents = events.slice(0, 3);
  const unreadNotifications = notifications.filter(n => !n.read);

  const groupMembers = currentGroup?.members
    .map(id => getUserById(id))
    .filter(Boolean) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Welcome back!</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Hello, {currentUser?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg opacity-90">
            Ready to connect with your community today?
          </p>
        </div>
        <div className="absolute right-8 bottom-0 opacity-20">
          <Users className="w-32 h-32" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-soft hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{groupMembers.length}</p>
                <p className="text-sm text-muted-foreground">Group Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{daysRemaining}</p>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{events.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unreadNotifications.length}</p>
                <p className="text-sm text-muted-foreground">Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Group Card */}
        <Card className="lg:col-span-2 border-border/50 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl">Your Current Group</CardTitle>
              <CardDescription>{currentGroup?.name}</CardDescription>
            </div>
            <Link to="/group">
              <Button variant="outline" size="sm" className="gap-2">
                View Group <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{currentGroup?.description}</p>
            
            {/* Group Members */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-3">
                {groupMembers.slice(0, 4).map((member) => (
                  <Avatar key={member?.id} className="border-2 border-background w-10 h-10">
                    <AvatarImage src={member?.avatar} alt={member?.name} />
                    <AvatarFallback>{member?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {groupMembers.map(m => m?.name?.split(' ')[0]).join(', ')}
              </div>
            </div>

            {/* Checklist Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Group Checklist</span>
                <span className="text-sm text-muted-foreground">
                  {currentGroup?.checklist.filter(i => i.completed).length} / {currentGroup?.checklist.length}
                </span>
              </div>
              <div className="space-y-2">
                {currentGroup?.checklist.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${item.completed ? 'text-success' : 'text-muted-foreground'}`} />
                    <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreadNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                You're all caught up! 🎉
              </p>
            ) : (
              unreadNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className="p-3 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'group' ? 'bg-primary' :
                      notification.type === 'event' ? 'bg-accent' : 'bg-info'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="border-border/50 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl">Upcoming Events</CardTitle>
            <CardDescription>Don't miss out on these activities</CardDescription>
          </div>
          <Link to="/events">
            <Button variant="outline" size="sm" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
              <div 
                key={event.id}
                className="rounded-xl overflow-hidden border border-border/50 hover:shadow-medium transition-all group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
                    {event.category}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.date), 'MMM dd')} at {event.time}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees.length} attending</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
