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
  History,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ApiFlow } from "@/lib/api-builder-types";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface FlowToolbarProps {
  flow: ApiFlow;
  onSave: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onNameChange: (name: string) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  hasUnsavedChanges?: boolean;
}

export function FlowToolbar({ 
  flow, 
  onSave, 
  onDelete, 
  onPublish, 
  onNameChange,
  onZoomIn = () => {},
  onZoomOut = () => {},
  onReset = () => {},
  hasUnsavedChanges = false
}: FlowToolbarProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = () => {
    setHistoryLoading(true);
    const versionKey = `api-flow-${flow.id}-history`;
    const versionsRaw = localStorage.getItem(versionKey);
    if (versionsRaw) {
      try {
        const versions = JSON.parse(versionsRaw);
        setHistoryList(versions.slice(-10).reverse());
      } catch (e) {
        setHistoryList([]);
      }
    } else {
      setHistoryList([]);
    }
    setHistoryLoading(false);
  };

  const handleRestoreVersion = (version: any) => {
    if (!version) return;
    localStorage.setItem(`api-flow-${flow.id}`, JSON.stringify(version));
    toast({
      title: "Version Restored",
      description: "This version of the flow has been restored.",
    });
    setShowHistoryDialog(false);
    window.location.reload();
  };

  const handleResetView = () => {
    const saved = localStorage.getItem(`api-flow-${flow.id}`);
    if (saved) {
      toast({
        title: "Flow Refreshed",
        description: "Reloaded from last saved version.",
      });
      setTimeout(() => window.location.reload(), 500);
    } else {
      toast({
        title: "No Saved Flow Found",
        description: "No previous version found in localStorage.",
        variant: "destructive",
      });
    }
  };

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

  const handleSave = () => {
    onSave();
    toast({
      title: "Flow Saved",
      description: "Your API flow has been saved successfully",
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    toast({
      title: "Flow Deleted",
      description: "Your API flow has been deleted",
    });
  };

  const handleShare = () => {
    const baseUrl = window.location.origin;
    setShareUrl(`${baseUrl}/api-builder/shared/${flow.id}`);
    setShowShareDialog(true);
  };

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Share link has been copied to clipboard",
    });
  };

  const handleExport = () => {
    const flowData = JSON.stringify(flow, null, 2);
    const blob = new Blob([flowData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${flow.name.replace(/\s+/g, "-").toLowerCase()}-flow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Flow Exported",
      description: "Your API flow has been exported as JSON",
    });
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={flow.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="max-w-[250px] font-medium"
          />
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
            {hasUnsavedChanges && (
              <Badge variant="destructive" className="ml-2 h-2 w-2 p-0 rounded-full" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={() => { loadHistory(); setShowHistoryDialog(true); }}>
            <span className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              {isMobile ? "" : "History"}
            </span>
          </Button>

          {!isMobile && (
            <>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </>
          )}
          
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            {isMobile ? "" : "Delete"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {!isMobile && (
            <>
              <Button variant="outline" size="sm" onClick={onZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
          
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
          
          {hasUnsavedChanges && !isMobile && (
            <span className="text-xs flex items-center text-amber-500">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved changes
            </span>
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

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Flow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API flow? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share API Flow</DialogTitle>
            <DialogDescription>
              Share this link with your team members to collaborate on this API flow.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <Input value={shareUrl} readOnly />
            <Button variant="outline" size="sm" onClick={handleCopyShareUrl}>
              Copy
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flow History</DialogTitle>
            <DialogDescription>
              Previous 10 versions of this API flow (auto-saved on Save or Publish).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mt-2">
            {historyLoading && <div className="text-muted-foreground text-xs">Loading...</div>}
            {(!historyLoading && historyList.length === 0) && (
              <div className="text-muted-foreground text-xs">No history found.</div>
            )}
            {historyList.map((v, idx) => (
              <div key={v.lastUpdated} className="flex items-center justify-between bg-accent p-2 rounded">
                <div>
                  <span className="font-semibold">{new Date(v.lastUpdated).toLocaleString()}</span>
                  <span className="block text-xs text-muted-foreground">{v.name}</span>
                </div>
                <Button variant="secondary" size="sm"
                  onClick={() => handleRestoreVersion(v)}>
                  Restore
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowHistoryDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
