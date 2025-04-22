
import { Panel } from 'reactflow';
import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface InstructionsPanelProps {
  isMobile: boolean;
}

export function InstructionsPanel({ isMobile }: InstructionsPanelProps) {
  return (
    <Panel position="top-left" className="p-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Instructions
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-2 text-xs">
            <p className="font-medium text-foreground">API Builder Instructions:</p>
            <div className="text-muted-foreground flex flex-col gap-1">
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
        </PopoverContent>
      </Popover>
    </Panel>
  );
}
