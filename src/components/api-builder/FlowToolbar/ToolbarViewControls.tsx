
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ToolbarViewControlsProps {
  isMobile: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  flowId: string;
}

export function ToolbarViewControls({
  isMobile,
  onZoomIn,
  onZoomOut,
  onReset,
  flowId,
}: ToolbarViewControlsProps) {
  // Reset handler pulls from last saved
  const handleResetView = () => {
    const saved = localStorage.getItem(`api-flow-${flowId}`);
    if (saved) {
      window.location.reload();
    }
  };

  if (isMobile) return null;

  return (
    <>
      <Button variant="outline" size="sm" onClick={onZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleResetView}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </>
  );
}
