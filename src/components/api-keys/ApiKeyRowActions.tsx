
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ApiKey } from "@/lib/types";

interface ApiKeyRowActionsProps {
  apiKey: ApiKey;
  isExpired: boolean;
  switchLoading: boolean;
  onToggle: () => void;
  onView: () => void;
  onRevoke: () => void;
  setShowRevokeDialog: (v: boolean) => void;
  setShowViewDialog: (v: boolean) => void;
}

export function ApiKeyRowActions({
  apiKey,
  isExpired,
  switchLoading,
  onToggle,
  onView,
  setShowRevokeDialog,
  setShowViewDialog,
}: ApiKeyRowActionsProps) {
  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex items-center gap-2">
        <Label htmlFor={`active-toggle-${apiKey.id}`} className="text-xs mr-1">Active</Label>
        <Switch
          id={`active-toggle-${apiKey.id}`}
          checked={apiKey.status === "active"}
          onCheckedChange={onToggle}
          disabled={apiKey.status === "revoked" || switchLoading || isExpired}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onView}>View</Button>
        {apiKey.status === "active" && !isExpired && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowRevokeDialog(true)}
          >
            Revoke
          </Button>
        )}
      </div>
    </div>
  );
}
