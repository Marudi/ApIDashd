
import * as React from "react";
import { Policy } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuotaSectionProps {
  quota: Policy["quota"];
  onSwitch: (checked: boolean) => void;
  onChange: (quota: Policy["quota"]) => void;
}

export function QuotaSection({ quota, onSwitch, onChange }: QuotaSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mt-4">
        <Label>Quota</Label>
        <Switch
          checked={quota?.enabled ?? false}
          onCheckedChange={onSwitch}
        />
      </div>
      {quota?.enabled && (
        <div className="flex gap-2 mt-2">
          <div>
            <Label className="text-xs">Quota</Label>
            <Input
              className="w-32"
              type="number"
              min={1}
              value={quota.max || ""}
              onChange={e =>
                onChange({
                  ...quota,
                  max: Number(e.target.value),
                  enabled: true,
                  per: quota.per || 86400,
                })
              }
            />
          </div>
          <div>
            <Label className="text-xs">Period (s)</Label>
            <Input
              className="w-32"
              type="number"
              min={1}
              value={quota.per || ""}
              onChange={e =>
                onChange({
                  ...quota,
                  per: Number(e.target.value),
                  enabled: true,
                  max: quota.max || 1000,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
