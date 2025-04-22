
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { AreaChart, Area } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBarIcon, ChartLine, RefreshCcw } from "lucide-react";

interface AnalyticsDataPoint {
  name: string;
  value: number;
  errors?: number;
  latency?: number;
}

const ApiAnalytics = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("24h");
  const [analyticsData, setAnalyticsData] = useState<{
    totalRequests: number;
    successRate: number;
    avgLatency: number;
    trafficData: AnalyticsDataPoint[];
    errorsData: AnalyticsDataPoint[];
    latencyData: AnalyticsDataPoint[];
    topEndpoints: { path: string; hits: number; errorRate: number }[];
  } | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data generation based on timeframe
    const hours = timeframe === "24h" ? 24 : timeframe === "7d" ? 7 * 24 : 30 * 24;
    const interval = timeframe === "24h" ? 1 : timeframe === "7d" ? 6 : 24;
    const dataPoints = hours / interval;
    
    const trafficData: AnalyticsDataPoint[] = [];
    const errorsData: AnalyticsDataPoint[] = [];
    const latencyData: AnalyticsDataPoint[] = [];
    
    let totalRequests = 0;
    let totalErrors = 0;
    let totalLatency = 0;
    
    for (let i = 0; i < dataPoints; i++) {
      const requests = Math.floor(Math.random() * 500) + 100;
      const errors = Math.floor(Math.random() * (requests * 0.1));
      const latency = Math.floor(Math.random() * 200) + 50;
      
      totalRequests += requests;
      totalErrors += errors;
      totalLatency += latency;
      
      let label = "";
      if (timeframe === "24h") {
        label = `${i}h`;
      } else if (timeframe === "7d") {
        label = `Day ${Math.floor(i / 4) + 1}`;
      } else {
        label = `Week ${Math.floor(i / 7) + 1}`;
      }
      
      trafficData.push({ name: label, value: requests });
      errorsData.push({ name: label, value: errors });
      latencyData.push({ name: label, value: latency });
    }
    
    const topEndpoints = [
      { path: "/api/products", hits: 2456, errorRate: 1.2 },
      { path: "/api/users", hits: 1832, errorRate: 0.8 },
      { path: "/api/orders", hits: 945, errorRate: 3.5 },
      { path: "/api/auth/login", hits: 723, errorRate: 4.2 },
      { path: "/api/search", hits: 589, errorRate: 0.5 },
    ];
    
    setAnalyticsData({
      totalRequests,
      successRate: 100 - ((totalErrors / totalRequests) * 100),
      avgLatency: totalLatency / dataPoints,
      trafficData,
      errorsData,
      latencyData,
      topEndpoints
    });
    
    setLoading(false);
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing Analytics",
      description: "Fetching the latest analytics data...",
    });
    fetchAnalyticsData();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5" />
            API Analytics
          </CardTitle>
          <CardDescription>
            Performance and usage statistics
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-muted-foreground">Loading analytics data...</div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Total Requests</p>
                    <h3 className="text-3xl font-bold mt-1">{formatNumber(analyticsData.totalRequests)}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Success Rate</p>
                    <h3 className="text-3xl font-bold mt-1">{analyticsData.successRate.toFixed(1)}%</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Avg. Latency</p>
                    <h3 className="text-3xl font-bold mt-1">{analyticsData.avgLatency.toFixed(0)}ms</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="traffic">
              <TabsList>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
                <TabsTrigger value="latency">Latency</TabsTrigger>
              </TabsList>
              <TabsContent value="traffic" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="errors" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.errorsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="latency" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.latencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#10b981" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <h3 className="text-lg font-medium mb-3">Top Endpoints</h3>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Path</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Hits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Error Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analyticsData.topEndpoints.map((endpoint, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{endpoint.path}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatNumber(endpoint.hits)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge className={endpoint.errorRate > 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                            {endpoint.errorRate}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={() => {
                toast({
                  title: "Analytics Dashboard",
                  description: "Redirecting to Analytics Dashboard...",
                });
                setTimeout(() => navigate("/analytics"), 1000);
              }}>
                View Full Analytics Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">Analytics data is not available for this API yet</p>
            <Button variant="outline" onClick={() => {
              toast({
                title: "Analytics Dashboard",
                description: "Redirecting to Analytics Dashboard...",
              });
              setTimeout(() => navigate("/analytics"), 1000);
            }}>View in Analytics Dashboard</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiAnalytics;
