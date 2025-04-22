
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Database, HeartPulse, Server, Zap } from "lucide-react";
import { mockSystemHealth } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const GatewayStatus = () => {
  // Format uptime from seconds to days, hours, minutes
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    Tyk Gateway
                    <Badge 
                      className="ml-2" 
                      variant={mockSystemHealth.gatewayStatus === "healthy" ? "default" : "destructive"}
                      style={{ 
                        backgroundColor: mockSystemHealth.gatewayStatus === "healthy" ? "#10b981" : 
                                        mockSystemHealth.gatewayStatus === "warning" ? "#f59e0b" : "#ef4444" 
                      }}
                    >
                      {mockSystemHealth.gatewayStatus}
                    </Badge>
                  </h2>
                  <p className="text-muted-foreground">v{mockSystemHealth.gatewayVersion}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-muted-foreground" />
                <span>Last checked: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Uptime"
          value={formatUptime(mockSystemHealth.uptime)}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
        <StatusCard
          title="CPU Usage"
          value={`${mockSystemHealth.cpuUsage}%`}
          icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          variant={mockSystemHealth.cpuUsage > 75 ? "warning" : "default"}
        />
        <StatusCard
          title="Memory Usage"
          value={`${mockSystemHealth.memoryUsage}%`}
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          variant={mockSystemHealth.memoryUsage > 80 ? "warning" : "default"}
        />
        <StatusCard
          title="Requests / Second"
          value={mockSystemHealth.requestsPerSecond.toFixed(1)}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
            <CardDescription>Current CPU utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current</span>
                  <span className={`text-sm font-medium ${mockSystemHealth.cpuUsage > 75 ? "text-yellow-500" : "text-green-500"}`}>
                    {mockSystemHealth.cpuUsage}%
                  </span>
                </div>
                <Progress 
                  value={mockSystemHealth.cpuUsage}
                  className={mockSystemHealth.cpuUsage > 75 ? "bg-yellow-100 h-2" : "bg-green-100 h-2"}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">CPU Usage History</h4>
                <div className="h-32 bg-muted/20 rounded-md flex items-end justify-between p-2">
                  {/* Simulated CPU history graph */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const height = Math.floor(Math.random() * 70) + 10;
                    return (
                      <div 
                        key={i} 
                        className="w-1.5 bg-primary rounded-t" 
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>24 hours ago</span>
                  <span>Now</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>Current memory utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current</span>
                  <span className={`text-sm font-medium ${mockSystemHealth.memoryUsage > 80 ? "text-yellow-500" : "text-green-500"}`}>
                    {mockSystemHealth.memoryUsage}%
                  </span>
                </div>
                <Progress 
                  value={mockSystemHealth.memoryUsage}
                  className={mockSystemHealth.memoryUsage > 80 ? "bg-yellow-100 h-2" : "bg-green-100 h-2"}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Memory Usage History</h4>
                <div className="h-32 bg-muted/20 rounded-md flex items-end justify-between p-2">
                  {/* Simulated memory history graph */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const height = Math.floor(Math.random() * 50) + 30;
                    return (
                      <div 
                        key={i} 
                        className="w-1.5 bg-primary rounded-t" 
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>24 hours ago</span>
                  <span>Now</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GatewayStatus;
