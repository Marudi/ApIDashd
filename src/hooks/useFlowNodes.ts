
import { useCallback } from "react";
import { Connection, useNodesState, useEdgesState, addEdge } from "reactflow";
import { toast } from "@/components/ui/use-toast";
import { ApiFlow } from "@/lib/api-builder-types";
import { isValidConnection } from "@/lib/api-builder/node-utils";

export function useFlowNodes(initialNodes: any[], initialEdges: any[]) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const duplicateNode = useCallback(
    (nodeId: string) => {
      const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
      if (!nodeToDuplicate) return;

      const newNode = {
        ...nodeToDuplicate,
        id: `${nodeToDuplicate.id}-copy`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (sourceNode && targetNode) {
        if (isValidConnection(sourceNode.type, targetNode.type)) {
          setEdges((eds) =>
            addEdge(
              {
                ...connection,
                animated: true,
                id: `e${connection.source}-${connection.target}`,
              },
              eds
            )
          );
        } else {
          toast({
            title: "Invalid Connection",
            description: `You cannot connect ${sourceNode.type} to ${targetNode.type}`,
            variant: "destructive",
          });
        }
      }
    },
    [nodes, setEdges]
  );

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    duplicateNode,
    deleteNode,
    onConnect,
  };
}
