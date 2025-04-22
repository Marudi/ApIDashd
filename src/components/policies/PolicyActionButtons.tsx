
import * as React from "react";
import { Button } from "@/components/ui/button";

interface PolicyActionButtonsProps {
  onCancel: () => void;
}

export function PolicyActionButtons({ onCancel }: PolicyActionButtonsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">Save</Button>
    </div>
  );
}
