
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ApiNodeData, ApiNodeType } from "@/lib/api-builder-types";
import { InputNodeConfig } from "./InputNodeConfig";
import { EndpointNodeConfig } from "./EndpointNodeConfig";
import { TransformNodeConfig } from "./TransformNodeConfig";
import { AuthNodeConfig } from "./AuthNodeConfig";
import { RateLimitNodeConfig } from "./RateLimitNodeConfig";
import { OutputNodeConfig } from "./OutputNodeConfig";
import { CacheNodeConfig } from "./CacheNodeConfig";

interface NodeConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: ApiNodeType;
  nodeData: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
}

export function NodeConfigDialog({ isOpen, onClose, nodeType, nodeData, onSave }: NodeConfigDialogProps) {
  const getConfigComponent = () => {
    switch (nodeType) {
      case 'input':
        return <InputNodeConfig data={nodeData} onSave={onSave} onCancel={onClose} />;
      case 'endpoint':
        return <EndpointNodeConfig data={nodeData} onSave={onSave} onCancel={onClose} />;
      case 'transform':
        return <TransformNodeConfig data={nodeData} onSave={onSave} onCancel={onClose} />;
      case 'auth':
        return <AuthNodeConfig data={nodeData} onSave={onSave} onCancel={onClose} />;
      case 'ratelimit':
        return <RateLimitNodeConfig data={nodeData} onSave={onSave} onCancel={onClose} />;
      case 'cache':
        return <CacheNodeConfig data={nodeData} onSave={onSave} onCancel={onClose} />;
      case 'output':
        return <OutputNodeConfig data={nodeData} onSave={onSave} onCancel={onClose} />;
      default:
        return <div>Configuration not available for this node type</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {nodeType} Node</DialogTitle>
        </DialogHeader>
        {getConfigComponent()}
      </DialogContent>
    </Dialog>
  );
}
