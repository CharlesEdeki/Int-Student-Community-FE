import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Users, Calendar, TrendingUp, LayoutDashboard, Settings, RefreshCw,
  Zap, ShieldCheck, Globe, LogOut, Search, Trash2, Lock, Plus,
  ArrowLeft, FileText, Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '@/services/api/admin';
import { tokenManager } from '@/services/api/client';
import type { UserDto, EventDto, GroupDto } from '@/services/api/types';

type AdminView = 'dashboard' | 'users' | 'events' | 'content' | 'categories';

interface AdminSession {
  userId: number;
  email: string;
  name: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AdminView>('dashboard');
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  // Data states
  const [users, setUsers] = useState<UserDto[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      navigate('/admin-login');
      return;
    }
    setAdminSession(JSON.parse(session));
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, groupsRes] = await Promise.all([
        adminApi.getUsers().catch(() => ({ success: false, data: null })),
        adminApi.getEvents().catch(() => ({ success: false, data: null })),
        adminApi.getGroups().catch(() => ({ success: false, data: null })),
      ]);
      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
      if (eventsRes.success && eventsRes.data) setEvents(eventsRes.data);
      if (groupsRes.success && groupsRes.data) setGroups(groupsRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    tokenManager.clearTokens();
    navigate('/admin-login');
  };

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.startDate) > now);
  const pastEvents = events.filter(e => new Date(e.startDate) <= now);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5" />
          <span className="font-bold">Intl Students Platform</span>
        </div>
        <nav className="flex items-center gap-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'events', label: 'Events', icon: Calendar },
            { key: 'content', label: 'Content', icon: FileText },
          ].map(item => (
            <Button
              key={item.key}
              variant="ghost"
              size="sm"
              onClick={() => setView(item.key as AdminView)}
              className={`text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-1.5 ${view === item.key ? 'bg-primary-foreground/15 text-primary-foreground' : ''}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5" />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/10 gap-1.5">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {view === 'dashboard' && <DashboardView users={users} groups={groups} upcomingEvents={upcomingEvents} pastEvents={pastEvents} setView={setView} onRefresh={loadData} />}
            {view === 'users' && <UsersView users={users} onRefresh={loadData} setView={setView} />}
            {view === 'events' && <EventsView events={events} onRefresh={loadData} setView={setView} />}
            {view === 'content' && <ContentView setView={setView} />}
          </>
        )}
      </main>
    </div>
  );
};

// ===== Dashboard Overview =====
const DashboardView: React.FC<{
  users: UserDto[];
  groups: GroupDto[];
  upcomingEvents: EventDto[];
  pastEvents: EventDto[];
  setView: (v: AdminView) => void;
  onRefresh: () => void;
}> = ({ users, groups, upcomingEvents, pastEvents, setView, onRefresh }) => {
  const stats = [
    { label: 'Users', value: users.length, color: 'text-primary' },
    { label: 'Groups', value: groups.length, color: 'text-primary' },
    { label: 'Upcoming Events', value: upcomingEvents.length, color: 'text-accent' },
    { label: 'Past Events', value: pastEvents.length, color: 'text-primary' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-primary" />
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="border-border/50 shadow-soft text-center">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-primary" /> Group Rotation
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Automatically reshuffle members into new groups for enhanced cultural integration.
            </p>
            <Button className="w-full bg-gradient-primary text-primary-foreground gap-2">
              <RefreshCw className="w-4 h-4" /> Run Rotation Now
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-muted-foreground" /> Adaptive Rules
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Evaluate and apply adaptive participation rules for active user engagement.
            </p>
            <Button variant="secondary" className="w-full gap-2">
              <Zap className="w-4 h-4" /> Evaluate Adaptive Rules
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-accent" /> Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setView('users')} className="gap-1.5">
            <Users className="w-4 h-4" /> Manage Users
          </Button>
          <Button variant="outline" size="sm" onClick={() => setView('events')} className="gap-1.5">
            <Calendar className="w-4 h-4" /> Manage Events
          </Button>
          <Button variant="outline" size="sm" onClick={() => setView('content')} className="gap-1.5">
            <FileText className="w-4 h-4" /> Manage Content
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-accent border-accent/30">
            <Tag className="w-4 h-4" /> Manage Categories
          </Button>
        </div>
      </div>
    </div>
  );
};

// ===== Users Management =====
const UsersView: React.FC<{
  users: UserDto[];
  onRefresh: () => void;
  setView: (v: AdminView) => void;
}> = ({ users, onRefresh, setView }) => {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName}?`)) return;
    try {
      const res = await adminApi.removeUser(userId);
      if (res.success) {
        toast.success(`${userName} removed successfully`);
        onRefresh();
      } else {
        toast.error('Failed to remove user');
      }
    } catch {
      toast.error('Failed to remove user');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" /> Manage Users
        </h1>
      </div>

      <Card className="border-border/50 shadow-soft">
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || '—'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.country || '—'}</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <Lock className="w-3 h-3" /> Block
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleRemove(user.id, user.name)}
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button variant="outline" size="sm" onClick={() => setView('dashboard')} className="gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Button>
    </div>
  );
};

// ===== Events Management =====
const EventsView: React.FC<{
  events: EventDto[];
  onRefresh: () => void;
  setView: (v: AdminView) => void;
}> = ({ events, onRefresh, setView }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', location: '', startDate: '', endDate: '' });

  const handleCreate = async () => {
    if (!newEvent.title || !newEvent.startDate) {
      toast.error('Title and start date are required');
      return;
    }
    try {
      const res = await adminApi.createEvent({
        title: newEvent.title,
        location: newEvent.location,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate || newEvent.startDate,
      });
      if (res.success) {
        toast.success('Event created');
        setIsCreateOpen(false);
        setNewEvent({ title: '', location: '', startDate: '', endDate: '' });
        onRefresh();
      } else {
        toast.error('Failed to create event');
      }
    } catch {
      toast.error('Failed to create event');
    }
  };

  const handleDelete = async (eventId: string, title: string) => {
    if (!confirm(`Delete event "${title}"?`)) return;
    try {
      const res = await adminApi.deleteEvent(eventId);
      if (res.success) {
        toast.success('Event deleted');
        onRefresh();
      } else {
        toast.error('Failed to delete event');
      }
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' + new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } catch { return d; }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" /> Manage Events
        </h1>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add New Event
        </Button>
      </div>

      <Card className="border-border/50 shadow-soft">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(event => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.location || '—'}</TableCell>
                  <TableCell>{formatDate(event.startDate)}</TableCell>
                  <TableCell>{event.endDate ? formatDate(event.endDate) : '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <Calendar className="w-3 h-3" /> Add to Calendar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleDelete(event.id, event.title)}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button variant="outline" size="sm" onClick={() => setView('dashboard')} className="gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Button>

      {/* Create Event Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} placeholder="Event title" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={newEvent.location} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} placeholder="Location" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date & Time</Label>
                <Input type="datetime-local" value={newEvent.startDate} onChange={e => setNewEvent(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>End Date & Time</Label>
                <Input type="datetime-local" value={newEvent.endDate} onChange={e => setNewEvent(p => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-gradient-primary text-primary-foreground">Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ===== Content Management (placeholder) =====
const ContentView: React.FC<{ setView: (v: AdminView) => void }> = ({ setView }) => (
  <div className="space-y-6 animate-fade-in">
    <h1 className="text-3xl font-bold flex items-center gap-3">
      <FileText className="w-8 h-8 text-primary" /> Manage Content
    </h1>
    <Card className="border-border/50 shadow-soft">
      <CardContent className="p-8 text-center text-muted-foreground">
        Content management features coming soon.
      </CardContent>
    </Card>
    <Button variant="outline" size="sm" onClick={() => setView('dashboard')} className="gap-1.5">
      <ArrowLeft className="w-4 h-4" /> Back to Dashboard
    </Button>
  </div>
);

export default AdminDashboard;
