
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
