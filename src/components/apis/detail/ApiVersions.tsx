
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ApiDefinition, ApiVersion } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, PlusCircle, Versions } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ApiVersionsProps {
  api: ApiDefinition;
  formatDate: (dateString: string) => string;
  onEnableVersioning: () => void;
}

const ApiVersions = ({ api, formatDate, onEnableVersioning }: ApiVersionsProps) => {
  const { toast } = useToast();
  const [showNewVersionDialog, setShowNewVersionDialog] = useState(false);
  const [showVersionDetailDialog, setShowVersionDetailDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ApiVersion | null>(null);
  const [newVersionName, setNewVersionName] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleCreateVersion = () => {
    if (!newVersionName.trim()) {
      toast({
        title: "Error",
        description: "Version name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Creating New Version",
      description: `Creating version ${newVersionName}...`,
    });

    // Simulate API call to create a new version
    setTimeout(() => {
      toast({
        title: "Version Created",
        description: `Version ${newVersionName} has been created successfully.`,
      });
      setShowNewVersionDialog(false);
      setNewVersionName("");
    }, 1500);
  };

  const handleManageVersion = (version: ApiVersion) => {
    setSelectedVersion(version);
    setShowVersionDetailDialog(true);
  };

  const handleDeployVersion = () => {
    if (!selectedVersion) return;
    
    setIsDeploying(true);
    toast({
      title: "Deploying Version",
      description: `Deploying version ${selectedVersion.name}...`,
    });

    // Simulate API call to deploy the version
    setTimeout(() => {
      setIsDeploying(false);
      toast({
        title: "Version Deployed",
        description: `Version ${selectedVersion.name} has been deployed successfully.`,
      });
      setShowVersionDetailDialog(false);
    }, 2000);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Versions className="h-5 w-5" />
              API Versions
            </CardTitle>
            <CardDescription>
              Manage and deploy different versions of this API
            </CardDescription>
          </div>
          {api.versioningInfo?.enabled && (
            <Button 
              size="sm" 
              onClick={() => setShowNewVersionDialog(true)}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              New Version
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {api.versioningInfo?.enabled ? (
            <div className="space-y-4">
              {api.versioningInfo.versions.length > 0 ? (
                api.versioningInfo.versions.map((version) => (
                  <div key={version.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{version.name}</h3>
                        {version.id === "v2" && <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Current</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created: {formatDate(api.createdAt)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleManageVersion(version)}>Manage</Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border rounded-md">
                  <p className="text-muted-foreground mb-4">No versions created yet</p>
                  <Button onClick={() => setShowNewVersionDialog(true)}>Create First Version</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed rounded-md">
              <p className="text-muted-foreground mb-4">Versioning is not enabled for this API</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Enable versioning to manage different versions of your API, allowing you to make changes while maintaining backward compatibility.
              </p>
              <Button onClick={onEnableVersioning}>Enable Versioning</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Version Dialog */}
      <Dialog open={showNewVersionDialog} onOpenChange={setShowNewVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              Create a new version of your API. This will clone the current version as a starting point.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="versionName">Version Name</Label>
              <Input
                id="versionName"
                placeholder="e.g. v3"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewVersionDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateVersion}>Create Version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version Detail Dialog */}
      <Dialog open={showVersionDetailDialog} onOpenChange={setShowVersionDetailDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage Version: {selectedVersion?.name}</DialogTitle>
            <DialogDescription>
              View and modify settings for this API version
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="settings" className="pt-2">
            <TabsList>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="paths">Paths</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>
            <TabsContent value="settings" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active Status</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable this version</p>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {
                    toast({
                      title: "Status Updated",
                      description: `Version ${selectedVersion?.name} status updated successfully.`,
                    });
                  }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input 
                    id="expiryDate" 
                    type="date" 
                    onChange={() => {
                      toast({
                        title: "Expiry Date Updated",
                        description: "The expiry date has been updated successfully.",
                      });
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Set a date after which this version will be automatically deprecated</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="paths" className="space-y-4 pt-4">
              <div className="border rounded-md divide-y">
                <div className="flex items-center justify-between p-3">
                  <span className="font-mono text-sm">/products</span>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="font-mono text-sm">/users</span>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="font-mono text-sm">/orders</span>
                  <Switch checked={true} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="deploy" className="space-y-4 pt-4">
              <div className="border rounded-md p-4 space-y-4">
                <div>
                  <h3 className="font-medium">Deployment Options</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose how you want to deploy this version
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="clearCache" className="rounded border-gray-300" />
                    <Label htmlFor="clearCache">Clear cache during deployment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notifyClients" className="rounded border-gray-300" />
                    <Label htmlFor="notifyClients">Notify connected clients</Label>
                  </div>
                </div>
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handleDeployVersion}
                  disabled={isDeploying}
                >
                  {isDeploying ? (
                    <>Deploying...</>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Deploy Version
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiVersions;
