import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/services/api/auth';
import { tokenManager } from '@/services/api/client';
import type { AuthTokens } from '@/services/api/types';

// Admin credentials - in production this should be validated server-side
const ADMIN_EMAIL = 'admin@platform.com';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error('Please enter email and password');
      setLoading(false);
      return;
    }

    try {
      // Use the same auth API to login
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        // Check if the logged-in user is admin
        if (response.data.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          toast.error('Access denied. Admin credentials required.');
          setLoading(false);
          return;
        }

        // Save tokens
        const tokens: AuthTokens = {
          accessToken: response.data.token,
          refreshToken: '',
          expiresIn: 3600,
          tokenType: 'Bearer',
        };
        tokenManager.setTokens(tokens);

        // Save admin session
        localStorage.setItem('admin_session', JSON.stringify({
          userId: response.data.userId,
          email: response.data.email,
          name: `${response.data.firstName} ${response.data.lastName}`,
        }));

        toast.success('Welcome, Admin!');
        navigate('/admin');
      } else {
        toast.error(response.errors?.[0] || 'Login failed');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <ShieldCheck className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Edinburgh Int'l Students Platform</p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-large border-border/50 animate-slide-up">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Sign in with your admin credentials</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@platform.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In as Admin
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-primary hover:underline font-medium"
              >
                ← Back to Student Login
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
