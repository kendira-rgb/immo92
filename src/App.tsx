import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Legal from "./pages/Legal";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/admin/Dashboard";
import AdminProperties from "./pages/admin/Properties";
import AdminMessages from "./pages/admin/Messages";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <Dashboard />
  </ProtectedRoute>
} />
            <Route path="/admin/properties" element={
  <ProtectedRoute requiredRole="admin">
    <AdminProperties />
  </ProtectedRoute>
} />
            <Route path="/admin/messages" element={
  <ProtectedRoute requiredRole="admin">
    <AdminMessages />
  </ProtectedRoute>
} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
