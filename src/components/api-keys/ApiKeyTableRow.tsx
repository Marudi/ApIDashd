
import { useState } from "react";
import { Calendar, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ApiKey } from "@/lib/types";
import { getPolicyName } from "@/lib/api-key-utils";
import { useToast } from "@/components/ui/use-toast";
import { ApiKeyStatusBadge } from "./ApiKeyStatusBadge";
import { ApiKeyViewDialog } from "./ApiKeyViewDialog";
import { ApiKeyRevokeDialog } from "./ApiKeyRevokeDialog";
import { ApiKeyExpirationDialog } from "./ApiKeyExpirationDialog";
import { ApiKeyRowActions } from "./ApiKeyRowActions";

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
  onUpdateExpiration,
}: ApiKeyTableRowProps) => {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showExpirationDialog, setShowExpirationDialog] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string | undefined>(apiKey.expires);
  const [switchLoading, setSwitchLoading] = useState(false);
  const { toast } = useToast();

  const maskedKey =
    apiKey.keyHash.slice(0, 8) + "..." + apiKey.keyHash.slice(-8);

  const isExpired = apiKey.expires && new Date(apiKey.expires) < new Date();

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

  const handleExpirationUpdate = (date: string | undefined) => {
    setExpirationDate(date);
    onUpdateExpiration(apiKey.id, date);
  };

  return (
    <>
      <TableRow
        className={
          apiKey.status === "revoked" || isExpired ? "opacity-60" : ""
        }
      >
        <TableCell className="font-mono text-xs">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            {maskedKey}
          </div>
        </TableCell>
        <TableCell>
          {apiKey.policyId ? (
            <span className="inline-block rounded bg-background px-2 py-1 text-xs border">
              {getPolicyName(apiKey.policyId)}
            </span>
          ) : (
            <span className="text-muted-foreground">No policy</span>
          )}
        </TableCell>
        <TableCell>
          <ApiKeyStatusBadge status={apiKey.status} isExpired={!!isExpired} />
        </TableCell>
        <TableCell className="text-xs">{formatDate(apiKey.createdAt)}</TableCell>
        <TableCell className="text-xs">
          <div className="flex items-center gap-1">
            {formatDate(apiKey.expires)}
            {apiKey.status !== "revoked" && (
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
          <ApiKeyRowActions
            apiKey={apiKey}
            isExpired={!!isExpired}
            switchLoading={switchLoading}
            onToggle={handleToggle}
            onView={() => setShowViewDialog(true)}
            onRevoke={() => {
              onRevoke(apiKey.id);
            }}
            setShowRevokeDialog={setShowRevokeDialog}
            setShowViewDialog={setShowViewDialog}
          />
        </TableCell>
      </TableRow>

      <ApiKeyViewDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        apiKey={apiKey}
        isExpired={!!isExpired}
      />

      <ApiKeyRevokeDialog
        open={showRevokeDialog}
        onOpenChange={setShowRevokeDialog}
        onRevoke={() => onRevoke(apiKey.id)}
      />

      <ApiKeyExpirationDialog
        open={showExpirationDialog}
        onOpenChange={setShowExpirationDialog}
        expirationDate={expirationDate}
        onSave={handleExpirationUpdate}
      />
    </>
  );
};
