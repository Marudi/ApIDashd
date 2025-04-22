
import { ControlButton, Controls, useReactFlow } from 'reactflow';
import { Save, Download, ZoomIn, ZoomOut, RotateCcw, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FlowControlsProps {
  onSave: () => void;
  onExport: () => void;
  onReset?: () => void;
}

export function FlowControls({ onSave, onExport, onReset }: FlowControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { toast } = useToast();

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 800 });
  };

  const handleClearCanvas = () => {
    // This would typically show a confirmation dialog
    // For now, just show a toast
    toast({
      title: "Feature Coming Soon",
      description: "Clear canvas functionality will be available in the next update",
    });
  };

  return (
    <Controls showInteractive={false}>
      <ControlButton onClick={onSave} title="Save Flow">
        <Save className="h-4 w-4" />
      </ControlButton>
      <ControlButton onClick={onExport} title="Export Flow">
        <Download className="h-4 w-4" />
      </ControlButton>
      <ControlButton onClick={handleZoomIn} title="Zoom In">
        <ZoomIn className="h-4 w-4" />
      </ControlButton>
      <ControlButton onClick={handleZoomOut} title="Zoom Out">
        <ZoomOut className="h-4 w-4" />
      </ControlButton>
      <ControlButton onClick={handleFitView} title="Fit View">
        <RotateCcw className="h-4 w-4" />
      </ControlButton>
      <ControlButton onClick={handleClearCanvas} title="Clear Canvas">
        <Trash2 className="h-4 w-4" />
      </ControlButton>
    </Controls>
  );
}
