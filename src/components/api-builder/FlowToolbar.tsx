import { useState } from "react";
import { ApiFlow } from "@/lib/api-builder-types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ToolbarActions } from "./FlowToolbar/ToolbarActions";
import { ToolbarViewControls } from "./FlowToolbar/ToolbarViewControls";
import { ToolbarPublishButton } from "./FlowToolbar/ToolbarPublishButton";
import { ShareDialog } from './FlowToolbar/ShareDialog';
import { DeleteConfirmDialog } from './FlowToolbar/DeleteConfirmDialog';
import { HistoryDialog } from './FlowToolbar/HistoryDialog';
import { SaveStatusIndicator } from './FlowToolbar/SaveStatusIndicator';
import { PublishProgress } from './FlowToolbar/PublishProgress';

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
  hasUnsavedChanges = false,
}: FlowToolbarProps) {
  const isMobile = useIsMobile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSetShareUrl = (url: string) => setShareUrl(url);

  return (
    <>
      <div className="flex items-center gap-2 mb-4 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <ToolbarActions
            flow={flow}
            onSave={onSave}
            onNameChange={onNameChange}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            showShareDialog={showShareDialog}
            setShowShareDialog={setShowShareDialog}
            shareUrl={shareUrl}
            setShareUrl={handleSetShareUrl}
            showHistoryDialog={showHistoryDialog}
            setShowHistoryDialog={setShowHistoryDialog}
            historyList={historyList}
            setHistoryList={setHistoryList}
            historyLoading={historyLoading}
            setHistoryLoading={setHistoryLoading}
            hasUnsavedChanges={hasUnsavedChanges}
            flowId={flow.id}
            isMobile={isMobile}
          />
        </div>
        <div className="flex items-center gap-2">
          <ToolbarViewControls
            isMobile={isMobile}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onReset={onReset}
            flowId={flow.id}
          />
          <ToolbarPublishButton
            flow={flow}
            onPublish={onPublish}
            isPublishing={isPublishing}
            setIsPublishing={setIsPublishing}
            progress={progress}
            setProgress={setProgress}
            hasUnsavedChanges={hasUnsavedChanges}
            isMobile={isMobile}
          />
          <SaveStatusIndicator hasUnsavedChanges={hasUnsavedChanges} />
        </div>
      </div>
      
      <PublishProgress isPublishing={isPublishing} progress={progress} />

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={onDelete}
      />
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl={shareUrl}
        onCopy={() => navigator.clipboard.writeText(shareUrl)}
      />
      <HistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        historyList={historyList}
        loading={historyLoading}
        onRestore={() => {
          /* restore handled in ToolbarActions, pass stub here if needed */
        }}
      />
    </>
  );
}
