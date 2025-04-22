import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ApisList from "./pages/ApisList";
import ApiDetail from "./pages/ApiDetail";
import Analytics from "./pages/Analytics";
import Policies from "./pages/Policies";
import ApiKeys from "./pages/ApiKeys";
import GatewayStatus from "./pages/GatewayStatus";
import KongGatewayStatus from "./pages/KongGatewayStatus";
import Settings from "./pages/Settings";
import ApiBuilder from "./pages/ApiBuilder";
import { gatewaySyncService } from "./services/gatewaySyncService";
import { Login } from '@/components/auth/Login';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { AuthService } from '@/lib/services/auth';

const queryClient = new QueryClient();

const App = () => {
  const authService = AuthService.getInstance();
  const isAuthenticated = authService.isAuthenticated();

  // Initialize gateway sync service
  useEffect(() => {
    // Access the service to ensure it's initialized
    const tykConfig = gatewaySyncService.getConfig("tyk");
    const kongConfig = gatewaySyncService.getConfig("kong");
    
    console.log("Gateway sync service initialized:", { 
      tykEnabled: tykConfig.enabled,
      kongEnabled: kongConfig.enabled 
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/apis" element={<ApisList />} />
            <Route path="/apis/:id" element={<ApiDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/keys" element={<ApiKeys />} />
            <Route path="/gateway" element={<GatewayStatus />} />
            <Route path="/kong-gateway" element={<KongGatewayStatus />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/api-builder" element={<ApiBuilder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
