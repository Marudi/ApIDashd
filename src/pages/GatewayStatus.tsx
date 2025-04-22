
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Database, HeartPulse, Network, Server, Shield } from "lucide-react";
import { mockSystemHealth } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gateway Status</h1>
          <p className="text-muted-foreground">Monitor the health of your API Gateways</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/gateway">
              <Server className="mr-2 h-4 w-4" />
              Tyk Gateway
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/kong-gateway">
              <Network className="mr-2 h-4 w-4" />
              Kong Gateway
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tyk">
        <TabsList className="mb-4">
          <TabsTrigger value="tyk" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Tyk Gateway Status
          </TabsTrigger>
          <TabsTrigger value="kong" className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            Kong Gateway Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tyk">
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
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
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
        </TabsContent>

        <TabsContent value="kong">
          <div className="mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Network className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center">
                        Kong Gateway
                        <Badge 
                          className="ml-2" 
                          variant="default"
                          style={{ backgroundColor: "#10b981" }}
                        >
                          healthy
                        </Badge>
                      </h2>
                      <p className="text-muted-foreground">v3.4.1</p>
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
              value="14d 0h 0m"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              variant="default"
            />
            <StatusCard
              title="Memory Usage"
              value="62%"
              icon={<Database className="h-4 w-4 text-muted-foreground" />}
              variant="default"
            />
            <StatusCard
              title="Active Connections"
              value="1,243"
              icon={<Network className="h-4 w-4 text-muted-foreground" />}
              variant="default"
            />
            <StatusCard
              title="Active Nodes"
              value="3"
              icon={<Server className="h-4 w-4 text-muted-foreground" />}
              variant="success"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Node Status</CardTitle>
                <CardDescription>Kong Gateway node health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "kong-primary", status: "healthy", lastPing: new Date() },
                    { name: "kong-replica-1", status: "healthy", lastPing: new Date() },
                    { name: "kong-replica-2", status: "warning", lastPing: new Date(Date.now() - 120000) }
                  ].map((node, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            node.status === 'healthy' ? 'bg-green-500' : 
                            node.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <h3 className="font-medium">{node.name}</h3>
                        </div>
                        <Badge 
                          variant={node.status === "healthy" ? "default" : "destructive"}
                          style={{ 
                            backgroundColor: node.status === "healthy" ? "#10b981" : 
                                           node.status === "warning" ? "#f59e0b" : "#ef4444" 
                          }}
                        >
                          {node.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Last Ping:</span>
                          <span>{node.lastPing.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Plugins</CardTitle>
                <CardDescription>Kong Gateway plugins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "rate-limiting", scope: "global", status: "active" },
                    { name: "key-auth", scope: "global", status: "active" },
                    { name: "oauth2", scope: "service", status: "active" },
                    { name: "cors", scope: "global", status: "active" },
                    { name: "request-transformer", scope: "route", status: "active" }
                  ].map((plugin, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <h4 className="font-medium">{plugin.name}</h4>
                        <p className="text-xs text-muted-foreground">Scope: {plugin.scope}</p>
                      </div>
                      <Badge variant={plugin.status === "active" ? "success" : "outline"}>
                        {plugin.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/kong-gateway">
                      View All Plugins
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default GatewayStatus;
