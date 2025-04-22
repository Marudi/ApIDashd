
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockApis } from "@/lib/mock-data";
import { ApiDefinition } from "@/lib/types";
import { ArrowLeft, Clock, Edit, Globe, Lock, Shield, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const ApiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [api, setApi] = useState<ApiDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll mock it using our existing data
    setLoading(true);
    
    // Find the API in our mockApis
    const foundApi = mockApis.find(api => api.id === id);
    
    // Also check the Kong APIs for the ID
    const kongApis = [
      {
        id: "k1",
        name: "User Service API",
        listenPath: "/users",
        targetUrl: "http://user-service:8080",
        protocol: "http",
        active: true,
        authType: "jwt" as const,
        lastUpdated: "2025-03-15T10:30:00Z",
        createdAt: "2025-01-15T10:30:00Z",
      },
      {
        id: "k2",
        name: "Product Catalog API",
        listenPath: "/products",
        targetUrl: "http://product-service:8081",
        protocol: "http",
        active: true,
        authType: "token" as const,
        lastUpdated: "2025-03-14T15:45:00Z",
        createdAt: "2025-01-14T15:45:00Z",
      },
      {
        id: "k3",
        name: "Payment Processing API",
        listenPath: "/payments",
        targetUrl: "http://payment-service:8082",
        protocol: "https",
        active: true,
        authType: "oauth" as const,
        lastUpdated: "2025-03-10T09:20:00Z",
        createdAt: "2025-01-10T09:20:00Z",
      },
      {
        id: "k4",
        name: "Analytics API",
        listenPath: "/analytics",
        targetUrl: "http://analytics-service:8083",
        protocol: "http",
        active: false,
        authType: "none" as const,
        lastUpdated: "2025-02-28T11:15:00Z",
        createdAt: "2025-01-28T11:15:00Z",
      }
    ];
    
    const kongApi = kongApis.find(api => api.id === id);
    
    if (foundApi) {
      setApi(foundApi);
    } else if (kongApi) {
      setApi(kongApi);
    } else {
      toast({
        title: "API Not Found",
        description: `No API found with ID: ${id}`,
        variant: "destructive",
      });
      // Redirect back to APIs list if not found
      setTimeout(() => navigate("/apis"), 1500);
    }
    
    setLoading(false);
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-lg">Loading API details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!api) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-lg text-muted-foreground">API not found</p>
          <Button onClick={() => navigate("/apis")}>Back to API List</Button>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/apis")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{api.name}</h1>
            <Badge variant={api.active ? "default" : "secondary"}>
              {api.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* API Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>API Overview</CardTitle>
            <CardDescription>Key details about this API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Listen Path</h3>
                  <p className="font-mono text-sm bg-muted p-2 rounded mt-1">{api.listenPath}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Target URL</h3>
                  <p className="font-mono text-sm bg-muted p-2 rounded mt-1">{api.targetUrl}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Protocol</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{api.protocol}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Authentication</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="capitalize">
                      {api.authType}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Created</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(api.createdAt)}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(api.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for API Management */}
        <Tabs defaultValue="security">
          <TabsList className="grid grid-cols-4 md:w-fit">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure authentication and authorization settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Authentication Type</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {api.authType}
                      </Badge>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Rate Limiting</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={api.rateLimit?.enabled ? "default" : "secondary"}>
                        {api.rateLimit?.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      {api.rateLimit?.enabled && (
                        <span className="text-sm text-muted-foreground">
                          {api.rateLimit.rate} requests per {api.rateLimit.per} seconds
                        </span>
                      )}
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Quota</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={api.quota?.enabled ? "default" : "secondary"}>
                        {api.quota?.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      {api.quota?.enabled && (
                        <span className="text-sm text-muted-foreground">
                          {api.quota.max} requests per {api.quota.per} seconds
                        </span>
                      )}
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="versions" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Versions</CardTitle>
                <CardDescription>
                  Manage and deploy different versions of this API
                </CardDescription>
              </CardHeader>
              <CardContent>
                {api.versioningInfo?.enabled ? (
                  <div className="space-y-4">
                    {api.versioningInfo.versions.map((version) => (
                      <div key={version.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h3 className="font-medium">{version.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created: {formatDate(api.createdAt)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">Versioning is not enabled for this API</p>
                    <Button>Enable Versioning</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Analytics</CardTitle>
                <CardDescription>
                  Performance and usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">Analytics data is not available for this API yet</p>
                  <Button variant="outline">View in Analytics Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Logs</CardTitle>
                <CardDescription>
                  Recent activity and error logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No recent logs for this API</p>
                  <Button variant="outline">Refresh Logs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ApiDetail;
