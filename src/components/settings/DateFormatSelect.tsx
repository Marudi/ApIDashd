
import { Label } from "@/components/ui/label";

interface DateFormatSelectProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function DateFormatSelect({ value, onChange, disabled }: DateFormatSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Date Format</Label>
      <select
        className="w-full h-10 px-3 py-2 border border-input rounded-md"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      >
        <option>MM/DD/YYYY</option>
        <option>DD/MM/YYYY</option>
        <option>YYYY-MM-DD</option>
      </select>
    </div>
  );
}
