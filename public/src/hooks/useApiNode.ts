
import { useReactFlow } from "reactflow";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { ApiNodeData } from "@/lib/api-builder-types";

export function useApiNode() {
  const { getNode, setNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = getNode(nodeId);
    if (!nodeToDuplicate) return;
    
    setNodes((nodes) => [
      ...nodes,
      {
        ...nodeToDuplicate,
        id: `${nodeToDuplicate.id}-copy-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
        selected: false,
        data: { ...nodeToDuplicate.data }
      }
    ]);
  }, [getNode, setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges]);

  const updateNodeData = useCallback((nodeId: string, data: Partial<ApiNodeData>) => {
    setNodes((nodes) => 
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  return {
    duplicateNode,
    deleteNode,
    updateNodeData
  };
}
