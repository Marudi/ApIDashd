
import { Panel } from 'reactflow';
import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface InstructionsPanelProps {
  isMobile: boolean;
}

export function InstructionsPanel({ isMobile }: InstructionsPanelProps) {
  return (
    <Panel position="top-left" className={`p-2 ${isMobile ? 'w-full' : ''}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size={isMobile ? "default" : "sm"}
            className={`gap-2 ${isMobile ? "w-full text-base px-4 py-3" : ""}`}
            style={isMobile ? { minHeight: "44px" } : undefined}
          >
            <Info className={`h-4 w-4 ${isMobile ? "text-blue-600" : "text-blue-500"}`} />
            Instructions
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={8}
          align={isMobile ? "center" : "start"}
          className={`w-80 rounded-lg shadow-lg sm:text-xs text-sm ${
            isMobile ? "text-base px-3 py-3 max-w-[96vw]" : ""
          }`}
        >
          <div className="flex flex-col gap-2">
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
