
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PersistenceToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function PersistenceToggle({ checked, onChange, disabled }: PersistenceToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>Persist API &amp; Key Data locally</Label>
        <p className="text-sm text-muted-foreground">
          Save API and key data in your browser for offline access and session restore.
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
