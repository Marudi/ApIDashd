
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiDefinition } from "@/lib/types";

interface ApiListProps {
  apis: ApiDefinition[];
  limit?: number;
}

export function ApiList({ apis, limit }: ApiListProps) {
  const displayApis = limit ? apis.slice(0, limit) : apis;

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Definitions</CardTitle>
        <CardDescription>
          {limit && apis.length > limit
            ? `Showing ${limit} of ${apis.length} APIs`
            : `All ${apis.length} APIs`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayApis.map((api) => (
            <div
              key={api.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${api.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <h3 className="font-medium">{api.name}</h3>
                  <p className="text-xs text-muted-foreground">{api.listenPath}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={api.active ? "default" : "outline"}>
                  {api.active ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : (
                    <X className="mr-1 h-3 w-3" />
                  )}
                  {api.active ? "Active" : "Inactive"}
                </Badge>
                <Link
                  to={`/apis/${api.id}`}
                  className="text-xs text-blue-500 hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
          {limit && apis.length > limit && (
            <div className="text-center mt-4">
              <Link
                to="/apis"
                className="text-sm text-blue-500 hover:underline"
              >
                View all APIs
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
