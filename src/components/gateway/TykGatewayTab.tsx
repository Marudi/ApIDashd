
import { StatusCard } from "@/components/dashboard/StatusCard";
import { GatewayCard } from "./GatewayCard";
import { MetricsCard } from "./MetricsCard";
import { Activity, Clock, Database } from "lucide-react";
import { SystemHealth } from "@/lib/types";

interface TykGatewayTabProps {
  health: SystemHealth;
  formatUptime: (seconds: number) => string;
}

export function TykGatewayTab({ health, formatUptime }: TykGatewayTabProps) {
  return (
    <>
      <div className="mb-6">
        <GatewayCard 
          type="tyk"
          status={health.gatewayStatus}
          version={health.gatewayVersion}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Uptime"
          value={formatUptime(health.uptime)}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
        <StatusCard
          title="CPU Usage"
          value={`${health.cpuUsage}%`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          variant={health.cpuUsage > 75 ? "warning" : "default"}
        />
        <StatusCard
          title="Memory Usage"
          value={`${health.memoryUsage}%`}
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          variant={health.memoryUsage > 80 ? "warning" : "default"}
        />
        <StatusCard
          title="Requests / Second"
          value={health.requestsPerSecond.toFixed(1)}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsCard
          title="CPU Usage"
          description="Current CPU utilization"
          currentValue={health.cpuUsage}
        />
        <MetricsCard
          title="Memory Usage"
          description="Current memory utilization"
          currentValue={health.memoryUsage}
        />
      </div>
    </>
  );
}
