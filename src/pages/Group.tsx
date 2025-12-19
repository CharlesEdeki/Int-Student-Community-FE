import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Users, MessageCircle, Lightbulb, CheckSquare, BarChart3, 
  MapPin, GraduationCap, Globe, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { toast } from 'sonner';

const Group: React.FC = () => {
  const { getCurrentGroup, getUserById, toggleChecklistItem, votePoll, currentUser } = useApp();
  const group = getCurrentGroup();

  if (!group) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No group assigned yet.</p>
      </div>
    );
  }

  const members = group.members.map(id => getUserById(id)).filter(Boolean);
  const daysRemaining = differenceInDays(new Date(group.expiresAt), new Date());
  const checklistProgress = (group.checklist.filter(i => i.completed).length / group.checklist.length) * 100;

  const handleVote = (pollId: string, optionId: string) => {
    const poll = group.polls.find(p => p.id === pollId);
    if (poll?.votedBy.includes(currentUser?.id || '')) {
      toast.info('You already voted on this poll');
      return;
    }
    votePoll(group.id, pollId, optionId);
    toast.success('Vote recorded!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Group Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-primary-foreground">
        <div className="relative z-10">
          <Badge className="bg-primary-foreground/20 text-primary-foreground mb-4">
            Active Group
          </Badge>
          <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
          <p className="text-lg opacity-90 mb-4">{group.description}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{members.length} members</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{daysRemaining} days remaining</span>
            </div>
          </div>
        </div>
        <div className="absolute right-8 bottom-0 opacity-20">
          <Users className="w-40 h-40" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members */}
        <Card className="lg:col-span-2 border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Group Members
            </CardTitle>
            <CardDescription>Connect with your community peers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map(member => (
                <div 
                  key={member?.id}
                  className="p-4 rounded-xl border border-border/50 hover:shadow-medium transition-all bg-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={member?.avatar} alt={member?.name} />
                        <AvatarFallback>{member?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {member?.isOnline && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{member?.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Globe className="w-3 h-3" />
                        <span>{member?.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-3 h-3" />
                        <span>{member?.major}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member?.interests.slice(0, 3).map(interest => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/chat">
              <Button className="w-full mt-4 gap-2 bg-gradient-primary text-primary-foreground">
                <MessageCircle className="w-4 h-4" />
                Open Group Chat
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Ice Breakers */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Ice Breakers
            </CardTitle>
            <CardDescription>Conversation starters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {group.iceBreakers.map((question, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-lg bg-accent/10 border border-accent/20"
              >
                <p className="text-sm text-foreground">{question}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-success" />
                  Group Checklist
                </CardTitle>
                <CardDescription>Complete activities together</CardDescription>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                {Math.round(checklistProgress)}% Complete
              </Badge>
            </div>
            <Progress value={checklistProgress} className="h-2 mt-4" />
          </CardHeader>
          <CardContent className="space-y-3">
            {group.checklist.map(item => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => {
                  toggleChecklistItem(group.id, item.id);
                  toast.success(item.completed ? 'Task unmarked' : 'Task completed! 🎉');
                }}
              >
                <Checkbox checked={item.completed} />
                <span className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {item.title}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Polls */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-info" />
              Group Polls
            </CardTitle>
            <CardDescription>Vote and decide together</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {group.polls.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active polls
              </p>
            ) : (
              group.polls.map(poll => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                const hasVoted = poll.votedBy.includes(currentUser?.id || '');

                return (
                  <div key={poll.id} className="space-y-3">
                    <p className="font-medium text-foreground">{poll.question}</p>
                    <div className="space-y-2">
                      {poll.options.map(option => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleVote(poll.id, option.id)}
                            disabled={hasVoted}
                            className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                              ${hasVoted 
                                ? 'bg-muted/50 border-border cursor-default' 
                                : 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer'}`}
                          >
                            {hasVoted && (
                              <div 
                                className="absolute inset-y-0 left-0 bg-primary/10"
                                style={{ width: `${percentage}%` }}
                              />
                            )}
                            <div className="relative flex items-center justify-between">
                              <span className="text-sm">{option.text}</span>
                              {hasVoted && (
                                <span className="text-sm text-muted-foreground">
                                  {option.votes} votes ({Math.round(percentage)}%)
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {totalVotes} total votes
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Group;
