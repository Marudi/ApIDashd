
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Check, Plus, Search, X, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPolicies, mockApis } from "@/lib/mock-data";
import { Policy } from "@/lib/types";
// Import PolicyEditor
import { PolicyEditor } from "@/components/policies/PolicyEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from "@/services/notificationService";
import { useDemoData } from "@/contexts/DemoDataContext";

const Policies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { notify } = useNotifications();
  const { showDemoData } = useDemoData();

  // Filter policies based on search term
  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for opening the dialog
  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setDialogOpen(true);
  };

  // Handler for policy save
  const handleSavePolicy = (updated: Policy) => {
    const isNew = !policies.some(p => p.id === updated.id);
    setPolicies(current =>
      current.map(p => (p.id === updated.id ? updated : p))
    );
    setDialogOpen(false);
    setEditingPolicy(null);

    // Send notification
    notify({
      title: isNew ? "New Policy Created" : "Policy Updated",
      message: `Policy "${updated.name}" has been ${isNew ? "created" : "updated"}.`,
      type: "api_change"
    });
  };

  // Handler for cancel
  const handleCancel = () => {
    setDialogOpen(false);
    setEditingPolicy(null);
  };

  return (
    <DashboardLayout>
      <div className={`mb-6 ${isMobile ? "flex flex-col gap-4" : "flex justify-between items-center gap-4"}`}>
        <div className={`relative ${isMobile ? "w-full" : "w-96"}`}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className={isMobile ? "w-full" : ""}>
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>

      {!showDemoData ? (
        <Card className="my-10 py-16 flex flex-col items-center gap-4 text-muted-foreground">
          <Shield className="w-10 h-10" />
          <div className="text-lg font-semibold">Demo Data Disabled</div>
          <div className="max-w-md mx-auto text-center">
            Demo/sample policies are currently disabled in your dashboard settings. To see example policies, enable <b>"Show demo data in dashboard"</b> in the <span className="font-medium">Settings</span> page.
          </div>
        </Card>
      ) : (
      <>
      <Card>
        <CardContent className="p-0">
          {isMobile ? (
            // Mobile view - card based layout
            <div className="p-4 space-y-4">
              {filteredPolicies.map((policy) => (
                <PolicyCardView key={policy.id} policy={policy} onEdit={handleEdit} />
              ))}
              {filteredPolicies.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No policies found matching your search criteria.
                </div>
              )}
            </div>
          ) : (
            // Desktop view - table layout
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>APIs</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Quota</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <PolicyTableRow key={policy.id} policy={policy} onEdit={handleEdit} />
                ))}
              </TableBody>
            </Table>
          )}

          {filteredPolicies.length === 0 && !isMobile && (
            <div className="py-12 text-center text-muted-foreground">
              No policies found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
          </DialogHeader>
          {editingPolicy && (
            <PolicyEditor policy={editingPolicy} onSave={handleSavePolicy} onCancel={handleCancel} />
          )}
        </DialogContent>
      </Dialog>
      </>
      )}
    </DashboardLayout>
  );
};

interface PolicyViewProps {
  policy: Policy;
  onEdit: (policy: Policy) => void;
}

const PolicyTableRow = ({ policy, onEdit }: PolicyViewProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get API names for the policy
  const apiNames = policy.apis.map(apiId => {
    const api = mockApis.find(a => a.id === apiId);
    return api ? api.name : "Unknown API";
  });

  return (
    <TableRow>
      <TableCell className="text-center">
        {policy.active ? (
          <Badge variant="default" className="w-8 justify-center bg-green-500">
            <Check className="h-3 w-3" />
          </Badge>
        ) : (
          <Badge variant="destructive" className="w-8 justify-center">
            <X className="h-3 w-3" />
          </Badge>
        )}
      </TableCell>
      <TableCell className="font-medium">{policy.name}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {apiNames.map((name, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {name}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        {policy.rateLimit?.enabled ? (
          <span>{policy.rateLimit.rate} per {policy.rateLimit.per}s</span>
        ) : (
          <span className="text-muted-foreground">None</span>
        )}
      </TableCell>
      <TableCell>
        {policy.quota?.enabled ? (
          <span>{policy.quota.max.toLocaleString()} / {policy.quota.per / 86400}d</span>
        ) : (
          <span className="text-muted-foreground">None</span>
        )}
      </TableCell>
      <TableCell className="text-xs">{formatDate(policy.lastUpdated)}</TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" onClick={() => onEdit(policy)}>
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

// Card view for mobile display
const PolicyCardView = ({ policy, onEdit }: PolicyViewProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get API names for the policy
  const apiNames = policy.apis.map(apiId => {
    const api = mockApis.find(a => a.id === apiId);
    return api ? api.name : "Unknown API";
  });

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{policy.name}</h3>
        {policy.active ? (
          <Badge variant="default" className="bg-green-500">
            <Check className="h-3 w-3 mr-1" /> Active
          </Badge>
        ) : (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" /> Inactive
          </Badge>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">APIs:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {apiNames.map((name, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {name}
              </Badge>
            ))}
            {apiNames.length === 0 && (
              <span className="text-muted-foreground text-xs">None</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <div>
            <span className="text-muted-foreground">Rate Limit:</span>
            <div>
              {policy.rateLimit?.enabled ? (
                <span>{policy.rateLimit.rate} per {policy.rateLimit.per}s</span>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Quota:</span>
            <div>
              {policy.quota?.enabled ? (
                <span>{policy.quota.max.toLocaleString()} / {policy.quota.per / 86400}d</span>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="text-xs text-muted-foreground">
            Updated: {formatDate(policy.lastUpdated)}
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit(policy)}>
            View
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Policies;
