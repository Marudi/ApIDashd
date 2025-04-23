
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Server } from "lucide-react";
import { mockSystemHealth } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { TykGatewayTab } from "@/components/gateway/TykGatewayTab";
import { KongGatewayTab } from "@/components/gateway/KongGatewayTab";
import { SyncStatusIndicator } from "@/components/gateway/SyncStatus";
import { useDemoData } from "@/contexts/DemoDataContext";
import { Card } from "@/components/ui/card";

const GatewayStatus = () => {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  const { showDemoData } = useDemoData();

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gateway Status</h1>
          <p className="text-muted-foreground">Monitor the health of your API Gateways</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/gateway">
              <Server className="mr-2 h-4 w-4" />
              Tyk Gateway
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/kong-gateway">
              <Network className="mr-2 h-4 w-4" />
              Kong Gateway
            </Link>
          </Button>
        </div>
      </div>
      {!showDemoData ? (
        <Card className="my-10 py-16 flex flex-col items-center gap-4 text-muted-foreground">
          <Server className="w-10 h-10" />
          <div className="text-lg font-semibold">Demo Data Disabled</div>
          <div className="max-w-md mx-auto text-center">
            Demo/sample gateway status data is currently disabled in your dashboard settings. To see example gateway status, enable <b>"Show demo data in dashboard"</b> in the <span className="font-medium">Settings</span> page.
          </div>
        </Card>
      ) : (
      <Tabs defaultValue="tyk">
        <TabsList className="mb-4">
          <TabsTrigger value="tyk" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Tyk Gateway Status
            <div className="ml-2">
              <SyncStatusIndicator type="tyk" />
            </div>
          </TabsTrigger>
          <TabsTrigger value="kong" className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            Kong Gateway Status
            <div className="ml-2">
              <SyncStatusIndicator type="kong" />
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tyk">
          <TykGatewayTab health={mockSystemHealth} formatUptime={formatUptime} />
        </TabsContent>

        <TabsContent value="kong">
          <KongGatewayTab />
        </TabsContent>
      </Tabs>
      )}
    </DashboardLayout>
  );
};

export default GatewayStatus;
