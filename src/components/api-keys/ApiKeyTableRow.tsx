
import { useState } from "react";
import { Calendar, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ApiKey } from "@/lib/types";
import { getPolicyName } from "@/lib/api-key-utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ApiKeyTableRowProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onUpdateExpiration: (id: string, expirationDate: string | undefined) => void;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const ApiKeyTableRow = ({ 
  apiKey, 
  onRevoke, 
  onToggleActive, 
  onUpdateExpiration 
}: ApiKeyTableRowProps) => {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showExpirationDialog, setShowExpirationDialog] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string | undefined>(apiKey.expires);
  const [switchLoading, setSwitchLoading] = useState(false);
  const { toast } = useToast();

  const maskedKey = apiKey.keyHash.slice(0, 8) + "..." + apiKey.keyHash.slice(-8);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey.keyHash);
    toast({
      title: "Key Copied",
      description: "API key has been copied to clipboard"
    });
  };

  const handleToggle = async () => {
    if (apiKey.status === "revoked") return;
    setSwitchLoading(true);
    const nextActive = apiKey.status !== "active";
    await onToggleActive(apiKey.id, nextActive);
    setSwitchLoading(false);
    toast({
      title: nextActive ? "Key Activated" : "Key Deactivated",
      description: `API key has been marked as ${nextActive ? "active" : "inactive"}`,
    });
  };

  const handleExpirationUpdate = () => {
    onUpdateExpiration(apiKey.id, expirationDate);
    setShowExpirationDialog(false);
  };

  const handleRemoveExpiration = () => {
    setExpirationDate(undefined);
    onUpdateExpiration(apiKey.id, undefined);
    setShowExpirationDialog(false);
  };

  const isExpired = apiKey.expires && new Date(apiKey.expires) < new Date();

  return (
    <>
      <TableRow className={
        apiKey.status === "revoked" || isExpired 
          ? "opacity-60" 
          : ""
      }>
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
            {isExpired ? "expired" : apiKey.status}
          </Badge>
        </TableCell>
        <TableCell className="text-xs">{formatDate(apiKey.createdAt)}</TableCell>
        <TableCell className="text-xs">
          <div className="flex items-center gap-1">
            {formatDate(apiKey.expires)}
            {!apiKey.status !== "revoked" && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => setShowExpirationDialog(true)}
              >
                <Calendar className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TableCell>
        <TableCell className="text-xs">
          {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : "Never"}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2">
              <Label htmlFor={`active-toggle-${apiKey.id}`} className="text-xs mr-1">Active</Label>
              <Switch
                id={`active-toggle-${apiKey.id}`}
                checked={apiKey.status === "active" && !isExpired}
                onCheckedChange={() => handleToggle()}
                disabled={apiKey.status === "revoked" || switchLoading || isExpired}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowViewDialog(true)}>View</Button>
              {apiKey.status === "active" && !isExpired && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setShowConfirmDialog(true)}
                >
                  Revoke
                </Button>
              )}
            </div>
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
                  variant={apiKey.status === "active" && !isExpired ? "default" : "destructive"}
                  className={apiKey.status === "active" && !isExpired ? "bg-green-500" : ""}
                >
                  {isExpired ? "expired" : apiKey.status}
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

      {/* Edit Expiration Dialog */}
      <Dialog open={showExpirationDialog} onOpenChange={setShowExpirationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Key Expiration</DialogTitle>
            <DialogDescription>
              Choose when this API key should expire. Leave empty for never.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expiration-date">Expiration Date</Label>
              <Input
                id="expiration-date"
                type="date"
                value={expirationDate ? new Date(expirationDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setExpirationDate(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleRemoveExpiration}>
              Never Expire
            </Button>
            <Button onClick={handleExpirationUpdate}>
              Save Expiration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
