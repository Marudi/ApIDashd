
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogsIcon, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface LogEntry {
  id: string;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  responseTime: number;
  ipAddress: string;
}

interface ApiLogsProps {
  onRefreshLogs: () => void;
  apiId: string;
}

const ApiLogs = ({ onRefreshLogs, apiId }: ApiLogsProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock log data - in production, this would come from your API
  const mockLogs: LogEntry[] = [
    {
      id: "log1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      path: "/api/products",
      method: "GET",
      statusCode: 200,
      responseTime: 120,
      ipAddress: "192.168.1.1"
    },
    {
      id: "log2",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      path: "/api/products/1",
      method: "GET",
      statusCode: 404,
      responseTime: 45,
      ipAddress: "192.168.1.2"
    },
    {
      id: "log3",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      path: "/api/products",
      method: "POST",
      statusCode: 201,
      responseTime: 230,
      ipAddress: "192.168.1.3"
    },
    {
      id: "log4",
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      path: "/api/products/2",
      method: "PUT",
      statusCode: 200,
      responseTime: 180,
      ipAddress: "192.168.1.4"
    },
    {
      id: "log5",
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      path: "/api/auth",
      method: "POST",
      statusCode: 401,
      responseTime: 60,
      ipAddress: "192.168.1.5"
    }
  ];

  useEffect(() => {
    // In production, this would fetch logs from your API
    const fetchLogs = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setLogs(mockLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch API logs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [apiId, toast]);

  const handleRefresh = () => {
    setLoading(true);
    // Call the parent's refresh handler
    onRefreshLogs();
    
    // Simulate refreshing logs
    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 800);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge className="bg-green-500">Success</Badge>;
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge variant="secondary" className="bg-amber-500 text-white">Client Error</Badge>;
    } else if (statusCode >= 500) {
      return <Badge variant="destructive">Server Error</Badge>;
    }
    return <Badge>{statusCode}</Badge>;
  };

  const filteredLogs = logs.filter(log => 
    log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.statusCode.toString().includes(searchTerm) ||
    log.ipAddress.includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <LogsIcon className="h-5 w-5" />
            API Logs
          </CardTitle>
          <CardDescription>
            Recent activity and error logs
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-muted-foreground">Loading logs...</div>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{formatTimestamp(log.timestamp)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {log.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[200px] truncate" title={log.path}>
                      {log.path}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.statusCode)}</TableCell>
                    <TableCell>{log.responseTime}ms</TableCell>
                    <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No logs found for this API</p>
            <Button variant="outline" onClick={handleRefresh}>Refresh Logs</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiLogs;
