
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ApiDefinition } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface ApiEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  api: ApiDefinition;
}

const ApiEditSheet = ({ open, onOpenChange, api }: ApiEditSheetProps) => {
  const { toast } = useToast();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit API</SheetTitle>
          <SheetDescription>
            Make changes to the API configuration.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                value={api.name} 
                readOnly 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Listen Path</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                value={api.listenPath} 
                readOnly 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target URL</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                value={api.targetUrl} 
                readOnly 
              />
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button onClick={e => {
                e.preventDefault();
                toast({
                  title: "API Updated",
                  description: "The API has been updated successfully.",
                });
                onOpenChange(false);
              }}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ApiEditSheet;
