
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AutoRefreshToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function AutoRefreshToggle({ checked, onChange, disabled }: AutoRefreshToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>Auto Refresh Dashboard</Label>
        <p className="text-sm text-muted-foreground">
          Automatically refresh data every 5 minutes
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
