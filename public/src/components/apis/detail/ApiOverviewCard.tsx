
import { Globe, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ApiDefinition } from "@/lib/types";

interface ApiOverviewCardProps {
  api: ApiDefinition;
  formatDate: (dateString: string) => string;
}

const ApiOverviewCard = ({ api, formatDate }: ApiOverviewCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>API Overview</CardTitle>
      <CardDescription>Key details about this API</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Listen Path</h3>
            <p className="font-mono text-sm bg-muted p-2 rounded mt-1">{api.listenPath}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Target URL</h3>
            <p className="font-mono text-sm bg-muted p-2 rounded mt-1">{api.targetUrl}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Protocol</h3>
            <div className="flex items-center gap-2 mt-1">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{api.protocol}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Authentication</h3>
            <div className="flex items-center gap-2 mt-1">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="capitalize">
                {api.authType}
              </Badge>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Created</h3>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(api.createdAt)}</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(api.lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ApiOverviewCard;
