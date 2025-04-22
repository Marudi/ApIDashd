
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Clock,
  Cog,
  Database,
  Key,
  LayoutDashboard,
  LineChart,
  LogOut,
  Puzzle,
  Server,
  Shield,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TykSidebar />
        <SidebarInset>
          <div className="p-4 h-full flex flex-col">
            <Header />
            <main className="flex-1 py-4">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function TykSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex items-center">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="w-8 h-8 bg-[#0BA5D3] rounded-md flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-lg font-semibold">ApIDashd Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavigationMenu />
      </SidebarContent>
      <SidebarFooter className="mt-auto p-4">
        <SidebarSeparator />
        <div className="text-xs text-muted-foreground">
          <p>Tyk API Gateway Dashboard</p>
          <p>Version 4.3.1</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavigationMenu() {
  const location = useLocation();
  const isPathActive = (path: string) => location.pathname === path;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isPathActive("/")}>
              <Link to="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isPathActive("/analytics")}>
              <Link to="/analytics">
                <BarChart3 />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isPathActive("/apis")}>
              <Link to="/apis">
                <Server />
                <span>APIs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isPathActive("/api-builder")}>
              <Link to="/api-builder">
                <Puzzle />
                <span>API Builder</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isPathActive("/policies")}>
              <Link to="/policies">
                <Shield />
                <span>Policies</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isPathActive("/keys")}>
              <Link to="/keys">
                <Key />
                <span>API Keys</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isPathActive("/gateway")}>
              <Link to="/gateway">
                <Activity />
                <span>Gateway Status</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isPathActive("/settings")}>
              <Link to="/settings">
                <Cog />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function Header() {
  const location = useLocation();
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/analytics":
        return "Analytics";
      case "/apis":
        return "API Definitions";
      case "/api-builder":
        return "API Builder";
      case "/policies":
        return "Policies";
      case "/keys":
        return "API Keys";
      case "/gateway":
        return "Gateway Status";
      case "/settings":
        return "Settings";
      default:
        return "Tyk Dashboard";
    }
  };

  return (
    <header className="flex justify-between items-center pb-4 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Last refreshed: {new Date().toLocaleTimeString()}
        </Button>
        <Button variant="ghost" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
