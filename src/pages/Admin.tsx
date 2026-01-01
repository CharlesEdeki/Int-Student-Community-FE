import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search, MoreVertical, TrendingUp, Calendar, Bell, UserPlus } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { users } = useApp();
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button className="bg-gradient-primary text-primary-foreground gap-2">
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>
      <Card className="border-border/50 shadow-soft">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Campus</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
                      <div><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>{user.campus}</TableCell>
                  <TableCell><Badge variant={user.isOnline ? 'default' : 'secondary'}>{user.isOnline ? 'Online' : 'Offline'}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{user.joinedAt}</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminMetrics: React.FC = () => {
  const { users, groups, events } = useApp();
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Platform Metrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ label: 'Total Users', value: users.length, icon: Users }, { label: 'Active Groups', value: groups.length, icon: Users }, { label: 'Events', value: events.length, icon: Calendar }, { label: 'Engagement', value: '87%', icon: TrendingUp }].map(stat => (
          <Card key={stat.label} className="border-border/50 shadow-soft">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><stat.icon className="w-6 h-6 text-primary" /></div>
              <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminAnnouncements: React.FC = () => {
  const { announcements, addAnnouncement } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = () => {
    if (title && content) {
      addAnnouncement({ title, content, author: 'Admin', priority: 'normal' });
      setTitle(''); setContent('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Announcements</h1>
      <Card className="border-border/50 shadow-soft">
        <CardHeader><CardTitle>Create Announcement</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
          <Button onClick={handleCreate} className="bg-gradient-primary text-primary-foreground">Post Announcement</Button>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {announcements.map(a => (
          <Card key={a.id} className="border-border/50 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary mt-1" />
                <div><h3 className="font-semibold">{a.title}</h3><p className="text-sm text-muted-foreground">{a.content}</p><p className="text-xs text-muted-foreground mt-2">by {a.author}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { AdminUsers, AdminMetrics, AdminAnnouncements };
