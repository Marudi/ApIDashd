
import { ReactFlowProvider } from 'reactflow';
import { ApiBuilderFlow } from "@/components/api-builder/ApiBuilderFlow";
import { ApiBuilderJsonEditor } from "@/components/api-builder/ApiBuilderJsonEditor";
import { useApiFlow } from "@/hooks/useApiFlow";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const ApiBuilder = () => {
  const { 
    flow,
    saveFlow,
    setFlow,
    unsavedChanges,
    setUnsavedChanges
  } = useApiFlow("user-1", "My First API");

  const handleFlowUpdate = (updatedFlow: any) => {
    setFlow(updatedFlow);
    setUnsavedChanges(true); // Explicitly set changes as unsaved when flow updates
  };

  const handleSaveFlow = () => {
    saveFlow(); // This will set unsavedChanges to false internally
  };

  return (
    <DashboardLayout>
      <ReactFlowProvider>
        <ApiBuilderFlow 
          onSave={handleSaveFlow} // Pass the wrapped save handler
          hasUnsavedChanges={unsavedChanges} // Pass unsaved changes state
        />
        <div className="mt-4 mb-8">
          <ApiBuilderJsonEditor 
            flow={flow} 
            updateFlow={handleFlowUpdate} 
          />
        </div>
      </ReactFlowProvider>
    </DashboardLayout>
  );
};

export default ApiBuilder;
