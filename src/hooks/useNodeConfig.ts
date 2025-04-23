
import { useState } from "react";
import { ApiNodeData, ApiNodeType } from "@/lib/api-builder-types";
import { Node } from "reactflow";
import { useToast } from "@/components/ui/use-toast";

export function useNodeConfig() {
  const [selectedNode, setSelectedNode] = useState<Node<ApiNodeData> | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { toast } = useToast();

  const openNodeConfig = (node: Node<ApiNodeData>) => {
    console.log("Opening node config for:", node.id, node.type);
    setSelectedNode(node);
    setIsConfigOpen(true);
  };

  const closeNodeConfig = () => {
    console.log("Closing node config dialog");
    setIsConfigOpen(false);
    // Don't clear selectedNode immediately to allow for animations
    setTimeout(() => setSelectedNode(null), 300);
  };

  const handleSaveNodeConfig = (updatedData: ApiNodeData, nodes: Node[], setNodes: (nodes: Node[]) => void) => {
    if (!selectedNode) {
      console.log("Cannot save node config: no node selected");
      return;
    }
    
    console.log("Saving node config for:", selectedNode.id, "with data:", updatedData);
    
    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          data: updatedData
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    setIsConfigOpen(false);
    
    toast({
      title: "Node Updated",
      description: `${selectedNode.type} node configuration has been updated`,
    });
  };

  return {
    selectedNode,
    isConfigOpen,
    openNodeConfig,
    closeNodeConfig,
    handleSaveNodeConfig
  };
}
