
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface ApiKeyExpirationDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  expirationDate: string | undefined;
  onSave: (date: string | undefined) => void;
}

export function ApiKeyExpirationDialog({
  open,
  onOpenChange,
  expirationDate: initialExpirationDate,
  onSave,
}: ApiKeyExpirationDialogProps) {
  const [expirationDate, setExpirationDate] = useState<string | undefined>(initialExpirationDate);

  useEffect(() => {
    setExpirationDate(initialExpirationDate);
  }, [initialExpirationDate, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Key Expiration</DialogTitle>
          <DialogDescription>
            Choose when this API key should expire. Leave empty for never.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expiration-date">Expiration Date</Label>
            <Input
              id="expiration-date"
              type="date"
              value={expirationDate ? new Date(expirationDate).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setExpirationDate(
                  e.target.value ? new Date(e.target.value).toISOString() : undefined
                )
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setExpirationDate(undefined);
              onSave(undefined);
              onOpenChange(false);
            }}
          >
            Never Expire
          </Button>
          <Button
            onClick={() => {
              onSave(expirationDate);
              onOpenChange(false);
            }}
          >
            Save Expiration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
