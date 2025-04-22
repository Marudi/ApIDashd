
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Server } from "lucide-react";
import { mockSystemHealth } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { TykGatewayTab } from "@/components/gateway/TykGatewayTab";
import { KongGatewayTab } from "@/components/gateway/KongGatewayTab";

const GatewayStatus = () => {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

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

      <Tabs defaultValue="tyk">
        <TabsList className="mb-4">
          <TabsTrigger value="tyk" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Tyk Gateway Status
          </TabsTrigger>
          <TabsTrigger value="kong" className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            Kong Gateway Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tyk">
          <TykGatewayTab health={mockSystemHealth} formatUptime={formatUptime} />
        </TabsContent>

        <TabsContent value="kong">
          <KongGatewayTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default GatewayStatus;
