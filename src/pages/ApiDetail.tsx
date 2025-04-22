
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockApis } from "@/lib/mock-data";
import { kongApis } from "@/lib/mock-apis";
import { ApiDefinition } from "@/lib/types";
import { ArrowLeft, Clock, Edit, Globe, Lock, Shield, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ApiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [api, setApi] = useState<ApiDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // In a real application, this would be an API call
    setLoading(true);
    
    // Find the API in our mockApis and kongApis
    const foundApi = mockApis.find(api => api.id === id) || kongApis.find(api => api.id === id);
    
    if (foundApi) {
      setApi(foundApi);
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

  const handleEditClick = () => {
    setShowEditSheet(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    toast({
      title: "API Deleted",
      description: `${api?.name} has been deleted successfully.`,
    });
    navigate("/apis");
  };

  const handleConfigureRateLimiting = () => {
    toast({
      title: "Rate Limiting Configuration",
      description: "Rate limiting configuration dialog will be implemented in the next release.",
    });
  };

  const handleConfigureQuota = () => {
    toast({
      title: "Quota Configuration",
      description: "Quota configuration dialog will be implemented in the next release.",
    });
  };

  const handleEnableVersioning = () => {
    toast({
      title: "Versioning Enabled",
      description: "API versioning has been enabled for this API.",
    });
  };

  const handleRefreshLogs = () => {
    toast({
      title: "Refreshing Logs",
      description: "Fetching the latest logs for this API...",
    });
    // Simulate a loading period
    setTimeout(() => {
      toast({
        title: "Logs Updated",
        description: "The logs have been refreshed successfully.",
      });
    }, 1500);
  };

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
            <Button variant="outline" className="flex items-center gap-2" onClick={handleEditClick}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" className="flex items-center gap-2" onClick={handleDeleteClick}>
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
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Authentication Type",
                          description: "Change authentication type dialog will be implemented in the next release.",
                        });
                      }}>Change</Button>
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
                      <Button variant="outline" size="sm" onClick={handleConfigureRateLimiting}>Configure</Button>
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
                      <Button variant="outline" size="sm" onClick={handleConfigureQuota}>Configure</Button>
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
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "Version Management",
                            description: `Managing version ${version.name} will be implemented in the next release.`,
                          });
                        }}>Manage</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">Versioning is not enabled for this API</p>
                    <Button onClick={handleEnableVersioning}>Enable Versioning</Button>
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
                  <Button variant="outline" onClick={() => {
                    toast({
                      title: "Analytics Dashboard",
                      description: "Redirecting to Analytics Dashboard...",
                    });
                    setTimeout(() => navigate("/analytics"), 1000);
                  }}>View in Analytics Dashboard</Button>
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
                  <Button variant="outline" onClick={handleRefreshLogs}>Refresh Logs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit API Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit API</SheetTitle>
            <SheetDescription>
              Make changes to the API configuration.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md" 
                  value={api.name} 
                  readOnly 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Listen Path</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md" 
                  value={api.listenPath} 
                  readOnly 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target URL</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md" 
                  value={api.targetUrl} 
                  readOnly 
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditSheet(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "API Updated",
                    description: "The API has been updated successfully.",
                  });
                  setShowEditSheet(false);
                }}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold">{api.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ApiDetail;
