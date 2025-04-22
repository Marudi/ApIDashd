
import * as React from "react";
import { Policy } from "@/lib/types";
import { mockApis } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface PolicyEditorProps {
  policy: Policy;
  onSave: (policy: Policy) => void;
  onCancel: () => void;
}

export function PolicyEditor({ policy, onSave, onCancel }: PolicyEditorProps) {
  const [form, setForm] = React.useState<Policy>({ ...policy });

  // Handle generic input
  const handleChange = (key: keyof Policy, value: any) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle API multi-select
  const toggleApi = (apiId: string) => {
    setForm(prev => ({
      ...prev,
      apis: prev.apis.includes(apiId)
        ? prev.apis.filter(id => id !== apiId)
        : [...prev.apis, apiId],
    }));
  };

  // Handle switches for rateLimit/quota enabled
  const handleRateLimitSwitch = (checked: boolean) => {
    setForm(prev => ({
      ...prev,
      rateLimit: {
        ...prev.rateLimit,
        enabled: checked,
        rate: prev.rateLimit?.rate || 100,
        per: prev.rateLimit?.per || 60,
      },
    }));
  };
  const handleQuotaSwitch = (checked: boolean) => {
    setForm(prev => ({
      ...prev,
      quota: {
        ...prev.quota,
        enabled: checked,
        max: prev.quota?.max || 1000,
        per: prev.quota?.per || 86400,
      },
    }));
  };

  // Save handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={e => handleChange("name", e.target.value)}
          placeholder="Policy Name"
        />
      </div>
      <div>
        <Label>Status</Label>
        <Switch
          checked={form.active}
          onCheckedChange={val => handleChange("active", val)}
        />
        <span className="ml-2 text-sm text-muted-foreground">{form.active ? "Active" : "Inactive"}</span>
      </div>
      <div>
        <Label>APIs Covered</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {mockApis.map(api => (
            <button
              type="button"
              key={api.id}
              className={`px-2 py-1 rounded border text-xs ${
                form.apis.includes(api.id)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-input"
              }`}
              onClick={() => toggleApi(api.id)}
            >
              {api.name}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {form.apis.length === 0 && "No APIs selected"}
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label>Rate Limit</Label>
            <Switch
              checked={form.rateLimit?.enabled ?? false}
              onCheckedChange={handleRateLimitSwitch}
            />
          </div>
          {form.rateLimit?.enabled && (
            <div className="flex gap-2">
              <div>
                <Label className="text-xs">Rate</Label>
                <Input
                  className="w-24"
                  type="number"
                  min={1}
                  value={form.rateLimit?.rate || ""}
                  onChange={e =>
                    handleChange("rateLimit", {
                      ...form.rateLimit,
                      rate: Number(e.target.value),
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
                  value={form.rateLimit?.per || ""}
                  onChange={e =>
                    handleChange("rateLimit", {
                      ...form.rateLimit,
                      per: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <Label>Quota</Label>
            <Switch
              checked={form.quota?.enabled ?? false}
              onCheckedChange={handleQuotaSwitch}
            />
          </div>
          {form.quota?.enabled && (
            <div className="flex gap-2">
              <div>
                <Label className="text-xs">Quota</Label>
                <Input
                  className="w-32"
                  type="number"
                  min={1}
                  value={form.quota?.max || ""}
                  onChange={e =>
                    handleChange("quota", {
                      ...form.quota,
                      max: Number(e.target.value),
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
                  value={form.quota?.per || ""}
                  onChange={e =>
                    handleChange("quota", {
                      ...form.quota,
                      per: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
