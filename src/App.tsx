import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Group from "@/pages/Group";
import Chat from "@/pages/Chat";
import Events from "@/pages/Events";
import Profile from "@/pages/Profile";
import Connections from "@/pages/Connections";
import { AdminUsers, AdminMetrics, AdminAnnouncements } from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { isAuthenticated, onboardingData } = useApp();
  
  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/onboarding" element={isAuthenticated ? <Onboarding /> : <Navigate to="/auth" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/metrics" element={<ProtectedRoute><AdminMetrics /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute><AdminAnnouncements /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
