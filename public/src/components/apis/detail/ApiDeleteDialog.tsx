
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ApiDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiName: string;
  onConfirm: () => void;
}

const ApiDeleteDialog = ({
  open,
  onOpenChange,
  apiName,
  onConfirm
}: ApiDeleteDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <span className="font-bold">{apiName}</span>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ApiDeleteDialog;
