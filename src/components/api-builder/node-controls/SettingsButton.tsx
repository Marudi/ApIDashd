
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
  onClick: (e: React.MouseEvent) => void;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  label?: boolean;
}

export const SettingsButton = memo(function SettingsButton({ 
  nodeType, 
  onClick, 
  size = "sm", 
  variant = "outline",
  label = true
}: SettingsButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            aria-label={`Configure ${nodeType} node`}
            className="flex items-center"
          >
            <Settings className="h-4 w-4" />
            {label && <span className="ml-1">Settings</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Configure {nodeType} settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
