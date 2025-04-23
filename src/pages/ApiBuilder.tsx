
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReactFlowProvider } from 'reactflow';
import { ApiBuilderFlow } from "@/components/api-builder/ApiBuilderFlow";

const ApiBuilder = () => {
  return (
    <DashboardLayout>
      <ReactFlowProvider>
        <ApiBuilderFlow />
      </ReactFlowProvider>
    </DashboardLayout>
  );
};

export default ApiBuilder;
