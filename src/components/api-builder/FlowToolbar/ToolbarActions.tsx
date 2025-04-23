
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, History, Share, Download, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApiFlow } from "@/lib/api-builder-types";

// Props for main Toolbar actions (save, history, share, export, delete, flow name)
export interface ToolbarActionsProps {
  flow: ApiFlow;
  onSave: () => void;
  onNameChange: (name: string) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (open: boolean) => void;
  showShareDialog: boolean;
  setShowShareDialog: (open: boolean) => void;
  shareUrl: string;
  setShareUrl: (url: string) => void;
  showHistoryDialog: boolean;
  setShowHistoryDialog: (open: boolean) => void;
  historyList: any[];
  setHistoryList: (list: any[]) => void;
  historyLoading: boolean;
  setHistoryLoading: (loading: boolean) => void;
  hasUnsavedChanges: boolean;
  flowId: string;
  isMobile: boolean;
}

export function ToolbarActions({
  flow,
  onSave,
  onNameChange,
  showDeleteConfirm,
  setShowDeleteConfirm,
  showShareDialog,
  setShowShareDialog,
  shareUrl,
  setShareUrl,
  showHistoryDialog,
  setShowHistoryDialog,
  historyList,
  setHistoryList,
  historyLoading,
  setHistoryLoading,
  hasUnsavedChanges,
  flowId,
  isMobile
}: ToolbarActionsProps) {
  const { toast } = useToast();

  // Export logic
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

  // History loading logic
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

  // Share logic
  const handleShare = () => {
    const baseUrl = window.location.origin;
    setShareUrl(`${baseUrl}/api-builder/shared/${flow.id}`);
    setShowShareDialog(true);
  };

  // Delete logic just opens dialog
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <Input
        value={flow.name}
        onChange={e => onNameChange(e.target.value)}
        className="max-w-[250px] font-medium"
      />
      <Button variant="outline" size="sm" onClick={onSave}>
        <Save className="mr-2 h-4 w-4" />
        Save
        {hasUnsavedChanges && (
          <Badge variant="destructive" className="ml-2 h-2 w-2 p-0 rounded-full" />
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          loadHistory();
          setShowHistoryDialog(true);
        }}
      >
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
    </>
  );
}
