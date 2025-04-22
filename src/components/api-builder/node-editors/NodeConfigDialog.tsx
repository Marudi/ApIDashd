import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputNodeConfig } from "./InputNodeConfig";
import { EndpointNodeConfig } from "./EndpointNodeConfig";
import { TransformNodeConfig } from "./TransformNodeConfig";
import { AuthNodeConfig } from "./AuthNodeConfig";
import { RateLimitNodeConfig } from "./RateLimitNodeConfig";
import { ApiNodeData, ApiNodeType } from "@/lib/api-builder-types";

interface NodeConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: ApiNodeType | string;
  nodeData: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
}

export function NodeConfigDialog({ isOpen, onClose, nodeType, nodeData, onSave }: NodeConfigDialogProps) {
  // Ensure nodeType is a valid ApiNodeType
  const safeNodeType = nodeType as ApiNodeType;
  
  const configComponents: Record<ApiNodeType, React.ComponentType<any>> = {
    input: InputNodeConfig,
    endpoint: EndpointNodeConfig,
    transform: TransformNodeConfig,
    auth: AuthNodeConfig,
    ratelimit: RateLimitNodeConfig,
    cache: () => <div>Cache Configuration (Not Implemented)</div>,
    mock: () => <div>Mock Configuration (Not Implemented)</div>,
    validator: () => <div>Validator Configuration (Not Implemented)</div>,
    output: () => <div>Output Configuration (Not Implemented)</div>,
  };

  const ConfigComponent = configComponents[safeNodeType];

  if (!ConfigComponent) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {safeNodeType} Node</DialogTitle>
        </DialogHeader>
        <ConfigComponent data={nodeData} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
