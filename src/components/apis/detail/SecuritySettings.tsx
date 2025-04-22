
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { ApiDefinition } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface SecuritySettingsProps {
  api: ApiDefinition;
  onConfigureRateLimiting: () => void;
  onConfigureQuota: () => void;
}

const SecuritySettings = ({
  api,
  onConfigureRateLimiting,
  onConfigureQuota
}: SecuritySettingsProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Configure authentication and authorization settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Authentication Type</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {api.authType}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => {
                toast({
                  title: "Authentication Type",
                  description: "Change authentication type dialog will be implemented in the next release.",
                });
              }}>Change</Button>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium mb-2">Rate Limiting</h3>
            <div className="flex items-center gap-2">
              <Badge variant={api.rateLimit?.enabled ? "default" : "secondary"}>
                {api.rateLimit?.enabled ? "Enabled" : "Disabled"}
              </Badge>
              {api.rateLimit?.enabled && (
                <span className="text-sm text-muted-foreground">
                  {api.rateLimit.rate} requests per {api.rateLimit.per} seconds
                </span>
              )}
              <Button variant="outline" size="sm" onClick={onConfigureRateLimiting}>Configure</Button>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium mb-2">Quota</h3>
            <div className="flex items-center gap-2">
              <Badge variant={api.quota?.enabled ? "default" : "secondary"}>
                {api.quota?.enabled ? "Enabled" : "Disabled"}
              </Badge>
              {api.quota?.enabled && (
                <span className="text-sm text-muted-foreground">
                  {api.quota.max} requests per {api.quota.per} seconds
                </span>
              )}
              <Button variant="outline" size="sm" onClick={onConfigureQuota}>Configure</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
