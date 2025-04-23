
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPolicyName } from "@/lib/api-key-utils";
import { ApiKey } from "@/lib/types";
import { ApiKeyStatusBadge } from "./ApiKeyStatusBadge";
import { useToast } from "@/components/ui/use-toast";
import { useMemo } from "react";

interface ApiKeyViewDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  apiKey: ApiKey;
  isExpired: boolean;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export function ApiKeyViewDialog({ open, onOpenChange, apiKey, isExpired }: ApiKeyViewDialogProps) {
  const { toast } = useToast();

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey.keyHash);
    toast({
      title: "Key Copied",
      description: "API key has been copied to clipboard"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <ApiKeyStatusBadge status={apiKey.status} isExpired={isExpired} />
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
  );
}
