import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, Users, MessageCircle, Calendar, User, 
  Link as LinkIcon, Settings, Shield, LogOut, Globe, Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/group', label: 'My Group', icon: Users },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/connections', label: 'Connections', icon: LinkIcon },
  { path: '/profile', label: 'Profile', icon: User },
];

const adminItems = [
  { path: '/admin/users', label: 'User Management', icon: Users },
  { path: '/admin/metrics', label: 'Metrics', icon: LayoutDashboard },
  { path: '/admin/announcements', label: 'Announcements', icon: Bell },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, isAdmin, toggleAdmin, logout, notifications } = useApp();
  const location = useLocation();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">StudyConnect</h1>
            <p className="text-xs text-muted-foreground">Community</p>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-soft' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.path === '/chat' && unreadCount > 0 && (
                <Badge className="ml-auto bg-accent text-accent-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </NavLink>
          ))}

          {/* Admin Toggle */}
          <div className="pt-4">
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Admin Mode</span>
              </div>
              <Switch checked={isAdmin} onCheckedChange={toggleAdmin} />
            </div>
          </div>

          {/* Admin Navigation */}
          {isAdmin && (
            <div className="pt-2 space-y-1">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin Panel
              </p>
              {adminItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-accent text-accent-foreground shadow-soft' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-sidebar-border"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
