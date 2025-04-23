
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { mockPolicies } from "@/lib/mock-data";

interface NewKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPolicy: string | null;
  onPolicySelect: (policyId: string | null) => void;
  expirationDate: string | undefined;
  onExpirationChange: (date: string | undefined) => void;
  onGenerate: () => void;
}

export const NewKeyDialog = ({
  open,
  onOpenChange,
  selectedPolicy,
  onPolicySelect,
  expirationDate,
  onExpirationChange,
  onGenerate,
}: NewKeyDialogProps) => {
  const [availablePolicies, setAvailablePolicies] = useState(mockPolicies);
  
  // Format the expiration date for the input field
  const formattedExpirationDate = expirationDate 
    ? new Date(expirationDate).toISOString().split('T')[0]
    : '';

  useEffect(() => {
    // Reset policy selection when dialog closes
    if (!open) {
      onPolicySelect(null);
      onExpirationChange(undefined);
    }
  }, [open, onPolicySelect, onExpirationChange]);

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      onExpirationChange(new Date(value).toISOString());
    } else {
      onExpirationChange(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate New API Key</DialogTitle>
          <DialogDescription>
            Select a policy and optional expiration date for your new API key.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="policy" className="text-right">
              Policy
            </Label>
            <Select
              value={selectedPolicy || ""}
              onValueChange={(value) => onPolicySelect(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a policy" />
              </SelectTrigger>
              <SelectContent>
                {availablePolicies
                  .filter((policy) => policy.active)
                  .map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      {policy.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiration" className="text-right">
              Expires
            </Label>
            <Input
              id="expiration"
              type="date"
              className="col-span-3"
              value={formattedExpirationDate}
              onChange={handleExpirationChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onGenerate} disabled={!selectedPolicy}>
            Generate Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
