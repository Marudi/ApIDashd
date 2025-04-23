
import { Label } from "@/components/ui/label";

interface TimeZoneSelectProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function TimeZoneSelect({ value, onChange, disabled }: TimeZoneSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Time Zone</Label>
      <select
        className="w-full h-10 px-3 py-2 border border-input rounded-md"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      >
        <option>(UTC+00:00) UTC</option>
        <option>(UTC-05:00) Eastern Time (US & Canada)</option>
        <option>(UTC-06:00) Central Time (US & Canada)</option>
        <option>(UTC-07:00) Mountain Time (US & Canada)</option>
        <option>(UTC-08:00) Pacific Time (US & Canada)</option>
        <option>(UTC+01:00) Central European Time</option>
      </select>
    </div>
  );
}
