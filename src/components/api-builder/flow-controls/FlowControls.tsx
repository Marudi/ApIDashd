
import { ControlButton, Controls, useReactFlow } from 'reactflow';
import { Save, Download, ZoomIn, ZoomOut, RotateCcw, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FlowControlsProps {
  onSave: () => void;
  onExport: () => void;
  onReset?: () => void;
}

export function FlowControls({ onSave, onExport, onReset }: FlowControlsProps) {
  const { zoomIn, zoomOut, fitView, setNodes, setEdges } = useReactFlow();
  const { toast } = useToast();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
    setShowClearConfirm(true);
  };

  const confirmClearCanvas = () => {
    // Clear all nodes and edges
    setNodes([]);
    setEdges([]);
    
    toast({
      title: "Canvas Cleared",
      description: "All nodes and connections have been removed",
    });
  };

  const handleSave = () => {
    onSave();
    toast({
      title: "Flow Saved",
      description: "Your API flow has been saved successfully",
    });
  };

  const handleExport = () => {
    onExport();
    toast({
      title: "Flow Exported",
      description: "Your API flow has been exported successfully",
    });
  };

  return (
    <>
      <Controls showInteractive={false}>
        <ControlButton onClick={handleSave} title="Save Flow">
          <Save className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={handleExport} title="Export Flow">
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

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Canvas</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all nodes and connections from your API flow. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearCanvas} className="bg-destructive text-destructive-foreground">
              Clear Canvas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
