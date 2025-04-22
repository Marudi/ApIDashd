
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputNodeConfig } from "./InputNodeConfig";
import { EndpointNodeConfig } from "./EndpointNodeConfig";
import { TransformNodeConfig } from "./TransformNodeConfig";
import { ApiNodeData, ApiNodeType } from "@/lib/api-builder-types";

interface NodeConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: ApiNodeType;
  nodeData: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
}

export function NodeConfigDialog({ isOpen, onClose, nodeType, nodeData, onSave }: NodeConfigDialogProps) {
  // Map node types to their configuration components
  const configComponents = {
    input: InputNodeConfig,
    endpoint: EndpointNodeConfig,
    transform: TransformNodeConfig,
  };

  const ConfigComponent = configComponents[nodeType as keyof typeof configComponents];

  if (!ConfigComponent) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {nodeType} Node</DialogTitle>
        </DialogHeader>
        <ConfigComponent data={nodeData} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
