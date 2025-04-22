
import * as React from "react";
import { Policy } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { PolicyNameInput } from "./PolicyNameInput";
import { ApiMultiSelect } from "./ApiMultiSelect";
import { RateLimitSection } from "./RateLimitSection";
import { QuotaSection } from "./QuotaSection";
import { PolicyActionButtons } from "./PolicyActionButtons";

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

  const handleRateLimitChange = (rateLimit: Policy["rateLimit"]) => {
    setForm(prev => ({
      ...prev,
      rateLimit,
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

  const handleQuotaChange = (quota: Policy["quota"]) => {
    setForm(prev => ({
      ...prev,
      quota,
    }));
  };

  // Save handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <PolicyNameInput
        name={form.name}
        active={form.active}
        onChange={handleChange}
      />
      <ApiMultiSelect
        selectedApis={form.apis}
        toggleApi={toggleApi}
      />
      <Card>
        <CardContent className="space-y-4 pt-4">
          <RateLimitSection
            rateLimit={form.rateLimit}
            onSwitch={handleRateLimitSwitch}
            onChange={handleRateLimitChange}
          />
          <QuotaSection
            quota={form.quota}
            onSwitch={handleQuotaSwitch}
            onChange={handleQuotaChange}
          />
        </CardContent>
      </Card>
      <PolicyActionButtons onCancel={onCancel} />
    </form>
  );
}
