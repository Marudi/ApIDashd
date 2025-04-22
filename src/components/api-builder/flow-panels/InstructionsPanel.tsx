
import { Panel } from 'reactflow';
import { Info } from 'lucide-react';

interface InstructionsPanelProps {
  isMobile: boolean;
}

export function InstructionsPanel({ isMobile }: InstructionsPanelProps) {
  return (
    <Panel position="top-left" className="bg-background/80 p-3 rounded-md backdrop-blur-sm shadow-md max-w-xs">
      <div className="flex items-center gap-2 text-xs">
        <Info className="h-4 w-4 text-blue-500" />
        <div className="text-muted-foreground flex flex-col gap-1">
          <p className="font-medium text-foreground">API Builder Instructions:</p>
          {isMobile ? (
            <>
              <p>• Tap the menu to open the node palette</p>
              <p>• Drag nodes onto the canvas</p>
              <p>• Connect nodes to build your API flow</p>
              <p>• Tap a node to expand its details</p>
            </>
          ) : (
            <>
              <p>• Drag nodes from the left panel onto the canvas</p>
              <p>• Connect nodes by dragging from handles</p>
              <p>• Click a node to expand its details</p>
              <p>• Use Ctrl/Cmd+S to save your flow</p>
              <p>• Use mouse wheel to zoom in/out</p>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}
