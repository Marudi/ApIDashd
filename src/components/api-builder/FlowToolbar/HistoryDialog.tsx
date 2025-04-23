
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historyList: any[];
  loading: boolean;
  onRestore: (version: any) => void;
}

export function HistoryDialog({ open, onOpenChange, historyList, loading, onRestore }: HistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flow History</DialogTitle>
          <DialogDescription>
            Previous 10 versions of this API flow (auto-saved on Save or Publish).
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mt-2">
          {loading && <div className="text-muted-foreground text-xs">Loading...</div>}
          {(!loading && historyList.length === 0) && (
            <div className="text-muted-foreground text-xs">No history found.</div>
          )}
          {historyList.map((v) => (
            <div key={v.lastUpdated} className="flex items-center justify-between bg-accent p-2 rounded">
              <div>
                <span className="font-semibold">{new Date(v.lastUpdated).toLocaleString()}</span>
                <span className="block text-xs text-muted-foreground">{v.name}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => onRestore(v)}>
                Restore
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
