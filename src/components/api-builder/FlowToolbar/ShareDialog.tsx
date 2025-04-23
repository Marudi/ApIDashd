
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  onCopy: () => void;
}

export function ShareDialog({ open, onOpenChange, shareUrl, onCopy }: ShareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share API Flow</DialogTitle>
          <DialogDescription>
            Share this link with your team members to collaborate on this API flow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Input value={shareUrl} readOnly />
          <Button variant="outline" size="sm" onClick={onCopy}>
            Copy
          </Button>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
