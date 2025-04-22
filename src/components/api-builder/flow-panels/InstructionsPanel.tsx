
import { Panel } from 'reactflow';

interface InstructionsPanelProps {
  isMobile: boolean;
}

export function InstructionsPanel({ isMobile }: InstructionsPanelProps) {
  return (
    <Panel position="top-left" className="bg-background/80 p-2 rounded-md backdrop-blur-sm">
      {isMobile ? (
        <div className="text-xs text-muted-foreground">
          Drag nodes from sidebar to build your API
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">
          Drag nodes onto the canvas • Use Ctrl/Cmd+S to save
        </div>
      )}
    </Panel>
  );
}
