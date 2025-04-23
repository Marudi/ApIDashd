
import { AlertCircle, Check } from "lucide-react";

interface SaveStatusIndicatorProps {
  hasUnsavedChanges: boolean;
}

export function SaveStatusIndicator({ hasUnsavedChanges }: SaveStatusIndicatorProps) {
  console.log("SaveStatusIndicator hasUnsavedChanges:", hasUnsavedChanges);
  
  return hasUnsavedChanges ? (
    <span className="text-xs flex items-center text-amber-500">
      <AlertCircle className="h-3 w-3 mr-1" />
      Unsaved changes
    </span>
  ) : (
    <span className="text-xs flex items-center text-green-500">
      <Check className="h-3 w-3 mr-1" />
      Saved
    </span>
  );
}
