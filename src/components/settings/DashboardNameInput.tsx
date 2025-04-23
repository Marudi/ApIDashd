
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DashboardNameInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function DashboardNameInput({ value, onChange, disabled }: DashboardNameInputProps) {
  return (
    <div className="space-y-2">
      <Label>Dashboard Name</Label>
      <Input
        type="text"
        placeholder="Dashboard Name"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
