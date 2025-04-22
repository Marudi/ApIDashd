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
import ApiOverviewCard from "@/components/apis/detail/ApiOverviewCard";
import SecuritySettings from "@/components/apis/detail/SecuritySettings";
import ApiVersions from "@/components/apis/detail/ApiVersions";
import ApiAnalytics from "@/components/apis/detail/ApiAnalytics";
import ApiLogs from "@/components/apis/detail/ApiLogs";
import ApiEditSheet from "@/components/apis/detail/ApiEditSheet";
import ApiDeleteDialog from "@/components/apis/detail/ApiDeleteDialog";

const ApiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [api, setApi] = useState<ApiDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    const foundApi = mockApis.find(api => api.id === id) || kongApis.find(api => api.id === id);
    
    if (foundApi) {
      setApi(foundApi);
    } else {
      toast({
        title: "API Not Found",
        description: `No API found with ID: ${id}`,
        variant: "destructive",
      });
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

        <ApiOverviewCard api={api} formatDate={formatDate} />

        <Tabs defaultValue="security">
          <TabsList className="grid grid-cols-4 md:w-fit">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="space-y-4 pt-4">
            <SecuritySettings
              api={api}
              onConfigureRateLimiting={handleConfigureRateLimiting}
              onConfigureQuota={handleConfigureQuota}
            />
          </TabsContent>
          
          <TabsContent value="versions" className="pt-4">
            <ApiVersions
              api={api}
              formatDate={formatDate}
              onEnableVersioning={handleEnableVersioning}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="pt-4">
            <ApiAnalytics />
          </TabsContent>
          
          <TabsContent value="logs" className="pt-4">
            <ApiLogs onRefreshLogs={handleRefreshLogs} />
          </TabsContent>
        </Tabs>
      </div>

      <ApiEditSheet
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
        api={api}
      />

      <ApiDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        apiName={api.name}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  );
};

export default ApiDetail;
