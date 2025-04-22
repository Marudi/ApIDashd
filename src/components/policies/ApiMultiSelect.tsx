
import * as React from "react";
import { Policy } from "@/lib/types";
import { mockApis } from "@/lib/mock-data";
import { Label } from "@/components/ui/label";

interface ApiMultiSelectProps {
  selectedApis: string[];
  toggleApi: (apiId: string) => void;
}

export function ApiMultiSelect({ selectedApis, toggleApi }: ApiMultiSelectProps) {
  return (
    <div>
      <Label>APIs Covered</Label>
      <div className="flex flex-wrap gap-2 mt-1">
        {mockApis.map(api => (
          <button
            type="button"
            key={api.id}
            className={`px-2 py-1 rounded border text-xs ${
              selectedApis.includes(api.id)
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
        {selectedApis.length === 0 && "No APIs selected"}
      </div>
    </div>
  );
}
