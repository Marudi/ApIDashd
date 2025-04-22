
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ApiDefinition } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface ApiVersionsProps {
  api: ApiDefinition;
  formatDate: (dateString: string) => string;
  onEnableVersioning: () => void;
}

const ApiVersions = ({ api, formatDate, onEnableVersioning }: ApiVersionsProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Versions</CardTitle>
        <CardDescription>
          Manage and deploy different versions of this API
        </CardDescription>
      </CardHeader>
      <CardContent>
        {api.versioningInfo?.enabled ? (
          <div className="space-y-4">
            {api.versioningInfo.versions.map((version) => (
              <div key={version.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">{version.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created: {formatDate(api.createdAt)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({
                    title: "Version Management",
                    description: `Managing version ${version.name} will be implemented in the next release.`,
                  });
                }}>Manage</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Versioning is not enabled for this API</p>
            <Button onClick={onEnableVersioning}>Enable Versioning</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiVersions;
