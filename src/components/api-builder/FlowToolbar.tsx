
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Save, 
  Share, 
  Trash, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  RotateCcw, 
  History
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ApiFlow } from "@/lib/api-builder-types";

interface FlowToolbarProps {
  flow: ApiFlow;
  onSave: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onNameChange: (name: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function FlowToolbar({ 
  flow, 
  onSave, 
  onDelete, 
  onPublish, 
  onNameChange,
  onZoomIn,
  onZoomOut,
  onReset
}: FlowToolbarProps) {
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePublish = () => {
    setIsPublishing(true);
    setProgress(0);

    // Simulate a publishing process
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsPublishing(false);
          onPublish();
          toast({
            title: "API Published",
            description: `${flow.name} has been published successfully`,
          });
          return 100;
        }
        return newProgress;
      });
    }, 250);
  };

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap justify-between">
      <div className="flex items-center gap-2">
        <Input
          value={flow.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="max-w-[250px] font-medium"
        />
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4" />
        </Button>
        {flow.published ? (
          <Button variant="default" size="sm" className="bg-green-600">
            Published
          </Button>
        ) : (
          <Button 
            disabled={isPublishing} 
            onClick={handlePublish} 
            variant="default" 
            size="sm"
          >
            <Play className="mr-2 h-4 w-4" />
            Publish
          </Button>
        )}
      </div>

      {isPublishing && (
        <div className="w-full mt-2">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Publishing API...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
    </div>
  );
}
