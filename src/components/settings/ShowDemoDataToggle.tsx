
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ShowDemoDataToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function ShowDemoDataToggle({ checked, onChange, disabled }: ShowDemoDataToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>Show demo data in dashboard</Label>
        <p className="text-sm text-muted-foreground">
          Enable or disable displaying demo/sample data in dashboard pages.
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label="Show demo data"
      />
    </div>
  );
}
