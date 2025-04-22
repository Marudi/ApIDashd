import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Key, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockApiKeys, mockPolicies } from "@/lib/mock-data";
import { ApiKey } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const ApiKeys = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keys, setKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter API keys based on search term
  const filteredKeys = keys.filter(key => 
    // Only search by policy name since keys don't have names
    key.policyId ? getPolicyName(key.policyId).toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  const generateNewKey = () => {
    if (!selectedPolicy) {
      toast({
        title: "Error",
        description: "Please select a policy for the new key",
        variant: "destructive"
      });
      return;
    }

    const newKey: ApiKey = {
      id: uuidv4(),
      keyHash: uuidv4().replace(/-/g, ""),
      policyId: selectedPolicy,
      status: "active" as const,
      createdAt: new Date().toISOString(),
      expires: undefined,
      lastUsed: undefined
    };

    setKeys([newKey, ...keys]);
    setShowNewKeyDialog(false);
    setSelectedPolicy(null);
    
    toast({
      title: "Success",
      description: "New API key has been generated",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search API keys..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowNewKeyDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Hash</TableHead>
                <TableHead>Policy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.map((key) => (
                <ApiKeyTableRow 
                  key={key.id} 
                  apiKey={key} 
                  onRevoke={(id) => {
                    setKeys(keys.map(k => k.id === id ? { ...k, status: "revoked" } : k));
                    toast({
                      title: "Key Revoked",
                      description: "The API key has been revoked successfully"
                    });
                  }}
                />
              ))}
            </TableBody>
          </Table>

          {filteredKeys.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No API keys found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Select a policy to apply to this new API key.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Policies</h4>
              <div className="grid grid-cols-1 gap-2">
                {mockPolicies.map(policy => (
                  <Button 
                    key={policy.id}
                    variant={selectedPolicy === policy.id ? "default" : "outline"}
                    onClick={() => setSelectedPolicy(policy.id)}
                    className="justify-start"
                  >
                    {policy.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={generateNewKey}>
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

// Helper function to get policy name from policy ID
const getPolicyName = (policyId: string) => {
  const policy = mockPolicies.find(p => p.id === policyId);
  return policy ? policy.name : "Unknown Policy";
};

interface ApiKeyTableRowProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
}

const ApiKeyTableRow = ({ apiKey, onRevoke }: ApiKeyTableRowProps) => {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Generate a masked key for display
  const maskedKey = apiKey.keyHash.slice(0, 8) + "..." + apiKey.keyHash.slice(-8);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey.keyHash);
    toast({
      title: "Key Copied",
      description: "API key has been copied to clipboard"
    });
  };

  return (
    <>
      <TableRow className={apiKey.status === "revoked" ? "opacity-60" : ""}>
        <TableCell className="font-mono text-xs">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            {maskedKey}
          </div>
        </TableCell>
        <TableCell>
          {apiKey.policyId ? (
            <Badge variant="outline">{getPolicyName(apiKey.policyId)}</Badge>
          ) : (
            <span className="text-muted-foreground">No policy</span>
          )}
        </TableCell>
        <TableCell>
          <Badge 
            variant={apiKey.status === "active" ? "default" : "destructive"}
            className={apiKey.status === "active" ? "bg-green-500" : ""}
          >
            {apiKey.status}
          </Badge>
        </TableCell>
        <TableCell className="text-xs">{formatDate(apiKey.createdAt)}</TableCell>
        <TableCell className="text-xs">
          {apiKey.expires ? formatDate(apiKey.expires) : "Never"}
        </TableCell>
        <TableCell className="text-xs">
          {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : "Never"}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowViewDialog(true)}>View</Button>
            {apiKey.status === "active" && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setShowConfirmDialog(true)}
              >
                Revoke
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* View Key Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Key Hash</h4>
              <div className="flex items-center gap-2">
                <code className="bg-muted p-2 rounded text-xs font-mono w-full overflow-auto">
                  {apiKey.keyHash}
                </code>
                <Button variant="outline" size="sm" onClick={handleCopyKey}>
                  Copy
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Policy</h4>
                <p>{apiKey.policyId ? getPolicyName(apiKey.policyId) : "None"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <Badge 
                  variant={apiKey.status === "active" ? "default" : "destructive"}
                  className={apiKey.status === "active" ? "bg-green-500" : ""}
                >
                  {apiKey.status}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created</h4>
                <p>{formatDate(apiKey.createdAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Expires</h4>
                <p>{apiKey.expires ? formatDate(apiKey.expires) : "Never"}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Revoke Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onRevoke(apiKey.id);
                setShowConfirmDialog(false);
              }}
            >
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeys;
