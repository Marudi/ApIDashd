import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Progress } from "@/components/ui/progress";
import { Activity, Database, HeartPulse, Layers, Network, Server, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KongSystemHealth } from "@/lib/types";

// Mock data for Kong Gateway health
const mockKongHealth: KongSystemHealth = {
  status: "healthy",
  version: "3.4.1",
  uptime: 1209600, // 14 days in seconds
  nodes: [
    { id: "node1", name: "kong-primary", status: "healthy", lastPing: new Date().toISOString() },
    { id: "node2", name: "kong-replica-1", status: "healthy", lastPing: new Date().toISOString() },
    { id: "node3", name: "kong-replica-2", status: "warning", lastPing: new Date(Date.now() - 120000).toISOString() }
  ],
  memoryUsage: 62,
  databaseStatus: "connected",
  activeConnections: 1243
};

const KongGatewayStatus = () => {
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
                    Kong Gateway
                    <Badge 
                      className="ml-2" 
                      variant={mockKongHealth.status === "healthy" ? "default" : "destructive"}
                      style={{ 
                        backgroundColor: mockKongHealth.status === "healthy" ? "#10b981" : 
                                         mockKongHealth.status === "warning" ? "#f59e0b" : "#ef4444" 
                      }}
                    >
                      {mockKongHealth.status}
                    </Badge>
                  </h2>
                  <p className="text-muted-foreground">v{mockKongHealth.version}</p>
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
          value={formatUptime(mockKongHealth.uptime)}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
        <StatusCard
          title="Memory Usage"
          value={`${mockKongHealth.memoryUsage}%`}
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          variant={mockKongHealth.memoryUsage > 80 ? "warning" : "default"}
        />
        <StatusCard
          title="Active Connections"
          value={mockKongHealth.activeConnections.toLocaleString()}
          icon={<Network className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
        <StatusCard
          title="Database Status"
          value={mockKongHealth.databaseStatus}
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          variant={mockKongHealth.databaseStatus === "connected" ? "default" : "warning"}
        />
      </div>

      <Tabs defaultValue="nodes" className="mb-8">
        <TabsList>
          <TabsTrigger value="nodes">Node Status</TabsTrigger>
          <TabsTrigger value="plugins">Plugins</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nodes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Kong Nodes</CardTitle>
              <CardDescription>Status of all nodes in the Kong cluster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockKongHealth.nodes.map((node) => (
                  <div key={node.id} className="border rounded-md p-4">
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
                      <div className="flex justify-between mb-1">
                        <span>Node ID:</span>
                        <span className="font-mono">{node.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Ping:</span>
                        <span>{new Date(node.lastPing).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plugins" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Plugins</CardTitle>
              <CardDescription>Kong Gateway plugins currently enabled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "rate-limiting", scope: "global", status: "active" },
                  { name: "key-auth", scope: "global", status: "active" },
                  { name: "oauth2", scope: "service", status: "active" },
                  { name: "cors", scope: "global", status: "active" },
                  { name: "request-transformer", scope: "route", status: "active" },
                  { name: "response-transformer", scope: "route", status: "active" },
                  { name: "jwt", scope: "service", status: "active" },
                  { name: "acl", scope: "service", status: "inactive" }
                ].map((plugin, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <h4 className="font-medium">{plugin.name}</h4>
                      <p className="text-xs text-muted-foreground">Scope: {plugin.scope}</p>
                    </div>
                    <Badge variant={plugin.status === "active" ? "default" : "outline"}>
                      {plugin.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Health</CardTitle>
              <CardDescription>Kong Gateway services and their health status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "user-api", requests: 1234, success: 98.5, latency: 42 },
                  { name: "product-api", requests: 5678, success: 99.8, latency: 23 },
                  { name: "payment-service", requests: 890, success: 97.2, latency: 78 },
                  { name: "auth-service", requests: 4321, success: 99.5, latency: 35 }
                ].map((service, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{service.name}</h3>
                      <Badge 
                        variant={service.success > 99 ? "default" : service.success > 95 ? "secondary" : "destructive"}
                      >
                        {service.success}% success
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Requests</span>
                          <span>{service.requests.toLocaleString()}/hour</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Avg. Latency</span>
                          <span className={service.latency > 50 ? "text-yellow-500" : "text-green-500"}>
                            {service.latency}ms
                          </span>
                        </div>
                        <Progress 
                          value={100 - (service.latency / 100 * 100)} 
                          className="h-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>Current memory utilization across nodes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cluster Average</span>
                  <span className={`text-sm font-medium ${mockKongHealth.memoryUsage > 75 ? "text-yellow-500" : "text-green-500"}`}>
                    {mockKongHealth.memoryUsage}%
                  </span>
                </div>
                <Progress 
                  value={mockKongHealth.memoryUsage}
                  className={mockKongHealth.memoryUsage > 75 ? "bg-yellow-100 h-2" : "bg-green-100 h-2"}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Memory Usage By Node</h4>
                <div className="space-y-2">
                  {mockKongHealth.nodes.map(node => {
                    const nodeMemory = Math.floor(Math.random() * 20) + mockKongHealth.memoryUsage - 10;
                    return (
                      <div key={node.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{node.name}</span>
                          <span className={nodeMemory > 75 ? "text-yellow-500" : "text-green-500"}>
                            {nodeMemory}%
                          </span>
                        </div>
                        <Progress 
                          value={nodeMemory}
                          className={nodeMemory > 75 ? "bg-yellow-100 h-1" : "bg-green-100 h-1"}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Load Balancing Status</CardTitle>
            <CardDescription>Active targets and distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "api-cluster", algorithm: "round-robin", targets: 3, distribution: [35, 35, 30] },
                { name: "web-cluster", algorithm: "least-connections", targets: 2, distribution: [55, 45] }
              ].map((upstream, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{upstream.name}</h3>
                    <Badge variant="outline">
                      <div className="flex items-center">
                        <Layers className="mr-1 h-3 w-3" />
                        {upstream.algorithm}
                      </div>
                    </Badge>
                  </div>
                  <div className="text-sm mb-3">
                    <span className="text-muted-foreground">{upstream.targets} active targets</span>
                  </div>
                  <div className="flex h-4 rounded-md overflow-hidden">
                    {upstream.distribution.map((percent, i) => (
                      <div 
                        key={i}
                        className={`h-full ${
                          i === 0 ? "bg-blue-500" : 
                          i === 1 ? "bg-green-500" : 
                          i === 2 ? "bg-purple-500" : "bg-yellow-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    {upstream.distribution.map((percent, i) => (
                      <span key={i}>Target {i+1}: {percent}%</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KongGatewayStatus;
