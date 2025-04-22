
import * as React from "react";
import { Policy } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RateLimitSectionProps {
  rateLimit: Policy["rateLimit"];
  onSwitch: (checked: boolean) => void;
  onChange: (rateLimit: Policy["rateLimit"]) => void;
}

export function RateLimitSection({ rateLimit, onSwitch, onChange }: RateLimitSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>Rate Limit</Label>
        <Switch
          checked={rateLimit?.enabled ?? false}
          onCheckedChange={onSwitch}
        />
      </div>
      {rateLimit?.enabled && (
        <div className="flex gap-2 mt-2">
          <div>
            <Label className="text-xs">Rate</Label>
            <Input
              className="w-24"
              type="number"
              min={1}
              value={rateLimit.rate || ""}
              onChange={e =>
                onChange({
                  ...rateLimit,
                  rate: Number(e.target.value),
                  enabled: true,
                  per: rateLimit.per || 60,
                })
              }
            />
          </div>
          <div>
            <Label className="text-xs">Per (s)</Label>
            <Input
              className="w-24"
              type="number"
              min={1}
              value={rateLimit.per || ""}
              onChange={e =>
                onChange({
                  ...rateLimit,
                  per: Number(e.target.value),
                  enabled: true,
                  rate: rateLimit.rate || 100,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
