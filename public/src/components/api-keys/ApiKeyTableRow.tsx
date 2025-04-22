import { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ApiKey } from "@/lib/types";
import { getPolicyName } from "@/lib/api-key-utils";

interface ApiKeyTableRowProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const ApiKeyTableRow = ({ apiKey, onRevoke }: ApiKeyTableRowProps) => {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

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
