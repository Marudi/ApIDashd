
import { Server, Network, HeartPulse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GatewayCardProps {
  type: "tyk" | "kong";
  status: string;
  version: string;
}

export function GatewayCard({ type, status, version }: GatewayCardProps) {
  const Icon = type === "tyk" ? Server : Network;
  const title = `${type === "tyk" ? "Tyk" : "Kong"} Gateway`;

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                {title}
                <Badge 
                  className="ml-2" 
                  variant={status === "healthy" ? "default" : "destructive"}
                  style={{ 
                    backgroundColor: status === "healthy" ? "#10b981" : 
                                   status === "warning" ? "#f59e0b" : "#ef4444" 
                  }}
                >
                  {status}
                </Badge>
              </h2>
              <p className="text-muted-foreground">v{version}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
            <span>Last checked: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
