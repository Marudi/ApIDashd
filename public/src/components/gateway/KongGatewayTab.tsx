
import { StatusCard } from "@/components/dashboard/StatusCard";
import { GatewayCard } from "./GatewayCard";
import { MetricsCard } from "./MetricsCard";
import { Activity, Database, Network, Server } from "lucide-react";

const mockKongHealth = {
  status: "healthy" as const,
  version: "3.4.1",
  uptime: 1209600,
  memoryUsage: 62,
  activeConnections: 1243,
  databaseStatus: "connected" as const,
};

export function KongGatewayTab() {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <>
      <div className="mb-6">
        <GatewayCard 
          type="kong"
          status={mockKongHealth.status}
          version={mockKongHealth.version}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Uptime"
          value={formatUptime(mockKongHealth.uptime)}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
        <StatusCard
          title="Memory Usage"
          value={`${mockKongHealth.memoryUsage}%`}
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
        <StatusCard
          title="Active Connections"
          value={mockKongHealth.activeConnections.toLocaleString()}
          icon={<Network className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
        <StatusCard
          title="Active Nodes"
          value="3"
          icon={<Server className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsCard
          title="Memory Usage"
          description="Current memory utilization across nodes"
          currentValue={mockKongHealth.memoryUsage}
          nodeData={[
            { name: "kong-primary", value: 58 },
            { name: "kong-replica-1", value: 62 },
            { name: "kong-replica-2", value: 66 }
          ]}
        />
      </div>
    </>
  );
}
