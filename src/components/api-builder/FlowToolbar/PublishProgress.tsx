
import { Progress } from "@/components/ui/progress";

interface PublishProgressProps {
  isPublishing: boolean;
  progress: number;
}

export function PublishProgress({ isPublishing, progress }: PublishProgressProps) {
  if (!isPublishing) return null;
  
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center text-xs mb-1">
        <span>Publishing API...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
