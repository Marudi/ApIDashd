
import { Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ApiNodeType } from "@/lib/api-builder-types";
import { memo } from "react";

interface SettingsButtonProps {
  nodeType: ApiNodeType;
  onClick: (e: React.MouseEvent) => void;  // Accept a MouseEvent parameter
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const SettingsButton = memo(function SettingsButton({ 
  nodeType, 
  onClick, 
  size = "sm", 
  variant = "outline" 
}: SettingsButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={onClick}
            aria-label={`Configure ${nodeType} node`}
          >
            <Settings className="h-4 w-4" />
            <span className="ml-1">Settings</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Configure {nodeType} settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
