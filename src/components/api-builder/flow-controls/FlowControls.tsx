
import { ControlButton, Controls } from 'reactflow';
import { Save, Download } from 'lucide-react';

interface FlowControlsProps {
  onSave: () => void;
  onExport: () => void;
}

export function FlowControls({ onSave, onExport }: FlowControlsProps) {
  return (
    <Controls showInteractive={false}>
      <ControlButton onClick={onSave} title="Save Flow">
        <Save className="h-4 w-4" />
      </ControlButton>
      <ControlButton onClick={onExport} title="Export Flow">
        <Download className="h-4 w-4" />
      </ControlButton>
    </Controls>
  );
}
