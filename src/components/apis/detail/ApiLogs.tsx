
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ApiLogsProps {
  onRefreshLogs: () => void;
}

const ApiLogs = ({ onRefreshLogs }: ApiLogsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>API Logs</CardTitle>
      <CardDescription>
        Recent activity and error logs
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">No recent logs for this API</p>
        <Button variant="outline" onClick={onRefreshLogs}>Refresh Logs</Button>
      </div>
    </CardContent>
  </Card>
);

export default ApiLogs;
