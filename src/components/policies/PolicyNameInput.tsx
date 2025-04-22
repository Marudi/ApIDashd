
import * as React from "react";
import { Policy } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PolicyNameInputProps {
  name: string;
  active: boolean;
  onChange: (key: keyof Policy, value: any) => void;
}

export function PolicyNameInput({ name, active, onChange }: PolicyNameInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={name}
          onChange={e => onChange("name", e.target.value)}
          placeholder="Policy Name"
        />
      </div>
      <div>
        <Label>Status</Label>
        <Switch
          checked={active}
          onCheckedChange={val => onChange("active", val)}
        />
        <span className="ml-2 text-sm text-muted-foreground">{active ? "Active" : "Inactive"}</span>
      </div>
    </div>
  );
}
