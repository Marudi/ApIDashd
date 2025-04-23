
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReactFlowProvider } from 'reactflow';
import { ApiBuilderFlow } from "@/components/api-builder/ApiBuilderFlow";
import { ApiBuilderJsonEditor } from "@/components/api-builder/ApiBuilderJsonEditor";
import { useApiFlow } from "@/hooks/useApiFlow";

const ApiBuilder = () => {
  const { 
    flow,
    saveFlow,
    setFlow,
  } = useApiFlow("user-1", "My First API");

  const handleFlowUpdate = (updatedFlow: any) => {
    setFlow(updatedFlow);
    saveFlow();
  };

  return (
    <DashboardLayout>
      <ReactFlowProvider>
        <ApiBuilderFlow />
        <div className="mt-4 mb-8">
          <ApiBuilderJsonEditor flow={flow} updateFlow={handleFlowUpdate} />
        </div>
      </ReactFlowProvider>
    </DashboardLayout>
  );
};

export default ApiBuilder;
