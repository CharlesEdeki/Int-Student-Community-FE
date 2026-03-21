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
  userId: number | string;
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
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch data from backend
      console.log('[AdminDashboard] Loading data from backend...');
      const [usersRes, eventsRes, groupsRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getEvents(),
        adminApi.getGroups(),
      ]);

      console.log('[AdminDashboard] Users response:', usersRes);
      console.log('[AdminDashboard] Events response:', eventsRes);
      console.log('[AdminDashboard] Groups response:', groupsRes);

      // Handle users
      if (usersRes.success && usersRes.data) {
        const userData = Array.isArray(usersRes.data) ? usersRes.data : [];
        setUsers(userData);
        console.log('[AdminDashboard] Loaded', userData.length, 'users');
      } else {
        setUsers([]);
        console.error('[AdminDashboard] Users response failed:', usersRes.message || usersRes.errors);
        toast.error(`Failed to load users: ${usersRes.message || 'Unknown error'}`);
      }

      // Handle events
      if (eventsRes.success && eventsRes.data) {
        const eventData = Array.isArray(eventsRes.data) ? eventsRes.data : [];
        setEvents(eventData);
        console.log('[AdminDashboard] Loaded', eventData.length, 'events');
      } else {
        setEvents([]);
        console.error('[AdminDashboard] Events response failed:', eventsRes.message || eventsRes.errors);
        toast.error(`Failed to load events: ${eventsRes.message || 'Unknown error'}`);
      }

      // Handle groups
      if (groupsRes.success && groupsRes.data) {
        const groupData = Array.isArray(groupsRes.data) ? groupsRes.data : [];
        setGroups(groupData);
        console.log('[AdminDashboard] Loaded', groupData.length, 'groups');
      } else {
        setGroups([]);
        console.error('[AdminDashboard] Groups response failed:', groupsRes.message || groupsRes.errors);
        toast.error(`Failed to load groups: ${groupsRes.message || 'Unknown error'}`);
      }

      toast.success('Dashboard data loaded successfully');
    } catch (error) {
      console.error('[AdminDashboard] Failed to load dashboard data:', error);
      setUsers([]);
      setEvents([]);
      setGroups([]);
      toast.error(`Failed to load data from backend: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  const [isRotating, setIsRotating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleGroupRotation = async () => {
    setIsRotating(true);
    try {
      const res = await adminApi.triggerGroupRotation();
      if (res.success) {
        toast.success('Group rotation triggered successfully');
        onRefresh();
      } else {
        toast.error('Failed to trigger group rotation');
      }
    } catch (error) {
      console.error('Group rotation error:', error);
      toast.error('Error triggering group rotation');
    } finally {
      setIsRotating(false);
    }
  };

  const handleEvaluateRules = async () => {
    setIsEvaluating(true);
    try {
      const res = await adminApi.getGroupStats();
      if (res.success) {
        toast.success('Adaptive rules evaluated successfully');
      } else {
        toast.error('Failed to evaluate adaptive rules');
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('Error evaluating adaptive rules');
    } finally {
      setIsEvaluating(false);
    }
  };

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
            <Button 
              onClick={handleGroupRotation}
              disabled={isRotating}
              className="w-full bg-gradient-primary text-primary-foreground gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} /> 
              {isRotating ? 'Running...' : 'Run Rotation Now'}
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
            <Button 
              onClick={handleEvaluateRules}
              disabled={isEvaluating}
              variant="secondary" 
              className="w-full gap-2"
            >
              <Zap className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} /> 
              {isEvaluating ? 'Evaluating...' : 'Evaluate Adaptive Rules'}
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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName}?`)) return;
    
    setIsDeleting(userId);
    try {
      const res = await adminApi.removeUser(userId);
      if (res.success) {
        toast.success(`${userName} removed successfully`);
        onRefresh();
      } else {
        toast.error(`Failed to remove ${userName}`);
      }
    } catch (error) {
      console.error('Remove user error:', error);
      toast.error('Error removing user');
    } finally {
      setIsDeleting(null);
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
                        disabled={isDeleting === user.id}
                        className="gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleRemove(user.id, user.name)}
                      >
                        <Trash2 className="w-3 h-3" /> {isDeleting === user.id ? 'Removing...' : 'Remove'}
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
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', location: '', startDate: '', endDate: '' });

  const handleCreate = async () => {
    if (!newEvent.title || !newEvent.startDate) {
      toast.error('Title and start date are required');
      return;
    }

    setIsCreating(true);
    try {
      const eventPayload = {
        title: newEvent.title,
        location: newEvent.location || null,
        startDate: new Date(newEvent.startDate).toISOString(),
        endDate: newEvent.endDate ? new Date(newEvent.endDate).toISOString() : null,
        description: '',
        imageUrl: null,
        isVirtual: false,
        virtualLink: null,
        maxAttendees: 100,
      };

      const res = await adminApi.createEvent(eventPayload);
      if (res.success) {
        toast.success('Event created successfully');
        setIsCreateOpen(false);
        setNewEvent({ title: '', location: '', startDate: '', endDate: '' });
        onRefresh();
      } else {
        toast.error('Failed to create event');
      }
    } catch (error) {
      console.error('Create event error:', error);
      toast.error('Error creating event');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (eventId: string, title: string) => {
    if (!confirm(`Delete event "${title}"?`)) return;

    setIsDeleting(eventId);
    try {
      const res = await adminApi.deleteEvent(eventId);
      if (res.success) {
        toast.success('Event deleted successfully');
        onRefresh();
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Error deleting event');
    } finally {
      setIsDeleting(null);
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
        <Button 
          onClick={() => setIsCreateOpen(true)} 
          disabled={isCreating}
          className="bg-gradient-primary text-primary-foreground gap-2"
        >
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
                        disabled={isDeleting === event.id}
                        className="gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleDelete(event.id, event.title)}
                      >
                        <Trash2 className="w-3 h-3" /> {isDeleting === event.id ? 'Deleting...' : 'Delete'}
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
            <Button 
              variant="outline" 
              onClick={() => setIsCreateOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isCreating}
              className="bg-gradient-primary text-primary-foreground"
            >
              {isCreating ? 'Creating...' : 'Create Event'}
            </Button>
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
