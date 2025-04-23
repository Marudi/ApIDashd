
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { DemoDataProvider } from "./contexts/DemoDataContext";

const queryClient = new QueryClient();

const App = () => {
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
        <DemoDataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
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
          </BrowserRouter>
        </DemoDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
