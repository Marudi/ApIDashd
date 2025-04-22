
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockPolicies } from "@/lib/mock-data";

interface NewKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPolicy: string | null;
  onPolicySelect: (policyId: string) => void;
  onGenerate: () => void;
}

export const NewKeyDialog = ({
  open,
  onOpenChange,
  selectedPolicy,
  onPolicySelect,
  onGenerate,
}: NewKeyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate New API Key</DialogTitle>
          <DialogDescription>
            Select a policy to apply to this new API key.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Available Policies</h4>
            <div className="grid grid-cols-1 gap-2">
              {mockPolicies.map(policy => (
                <Button 
                  key={policy.id}
                  variant={selectedPolicy === policy.id ? "default" : "outline"}
                  onClick={() => onPolicySelect(policy.id)}
                  className="justify-start"
                >
                  {policy.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onGenerate}>
            Generate Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

