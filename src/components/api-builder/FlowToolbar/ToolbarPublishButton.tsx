
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { ApiFlow } from "@/lib/api-builder-types";
import { useToast } from "@/components/ui/use-toast";

interface ToolbarPublishButtonProps {
  flow: ApiFlow;
  onPublish: () => void;
  isPublishing: boolean;
  setIsPublishing: (b: boolean) => void;
  progress: number;
  setProgress: (v: number) => void;
  hasUnsavedChanges: boolean;
  isMobile: boolean;
}

export function ToolbarPublishButton({
  flow,
  onPublish,
  isPublishing,
  setIsPublishing,
  progress,
  setProgress,
  hasUnsavedChanges,
  isMobile,
}: ToolbarPublishButtonProps) {
  const { toast } = useToast();

  const handlePublish = () => {
    setIsPublishing(true);
    setProgress(0);

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

  // Show status
  return flow.published ? (
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
  );
}
