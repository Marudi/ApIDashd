
import { ReactFlowProvider } from 'reactflow';
import { ApiBuilderFlow } from "@/components/api-builder/ApiBuilderFlow";
import { ApiBuilderJsonEditor } from "@/components/api-builder/ApiBuilderJsonEditor";
import { useApiFlow } from "@/hooks/useApiFlow";

const ApiBuilder = () => {
  const { 
    flow,
    saveFlow,
    setFlow,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useApiFlow("user-1", "My First API");

  const handleFlowUpdate = (updatedFlow: any) => {
    setFlow(updatedFlow);
  };

  return (
    <DashboardLayout>
      <ReactFlowProvider>
        <ApiBuilderFlow 
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
        <div className="mt-4 mb-8">
          <ApiBuilderJsonEditor flow={flow} updateFlow={handleFlowUpdate} />
        </div>
      </ReactFlowProvider>
    </DashboardLayout>
  );
};

export default ApiBuilder;
