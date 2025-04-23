
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock } from "lucide-react";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ErrorsTable } from "@/components/dashboard/ErrorsTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { mockAnalytics } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useDemoData } from "@/contexts/DemoDataContext";

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("24h");
  const { showDemoData } = useDemoData();

  // Format the hourly data for the chart
  const hourlyData = mockAnalytics.hourlyStats.map(stat => ({
    hour: `${stat.hour}:00`,
    requests: stat.requests,
    errors: stat.errors,
    latency: stat.latency,
  }));

  // For additional chart - latency over time
  const latencyData = mockAnalytics.hourlyStats.map(stat => ({
    hour: `${stat.hour}:00`,
    latency: stat.latency,
  }));

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Monitor your API performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <select 
                className="bg-background border border-input rounded-md h-8 px-2 text-sm"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="1h">Last hour</option>
                <option value="6h">Last 6 hours</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>

          {!showDemoData ? (
            <div className="mt-10 flex flex-col items-center justify-center gap-4 text-center text-muted-foreground">
              <BarChart3 className="h-10 w-10 text-muted-foreground" />
              <div className="text-lg font-semibold">Demo Data Disabled</div>
              <div className="max-w-md mx-auto">
                Demo/sample analytics data is currently disabled in your dashboard settings. To view demo analytics, enable "Show demo data in dashboard" in the <span className="font-medium">Settings</span> page.
              </div>
            </div>
          ) : (
          <>
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatusCard
                title="Total Requests"
                value={mockAnalytics.total.toLocaleString()}
                description="Last 24 hours"
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 8.2, positive: true }}
              />
              <StatusCard
                title="Success Rate"
                value={`${((mockAnalytics.successful / mockAnalytics.total) * 100).toFixed(1)}%`}
                description="Last 24 hours"
                variant="success"
                trend={{ value: 1.5, positive: true }}
              />
              <StatusCard
                title="Average Latency"
                value={`${mockAnalytics.avgLatency}ms`}
                description="Last 24 hours"
                variant={mockAnalytics.avgLatency > 150 ? "warning" : "default"}
                trend={{ value: 3.1, positive: false }}
              />
              <StatusCard
                title="Error Rate"
                value={`${((mockAnalytics.errored / mockAnalytics.total) * 100).toFixed(1)}%`}
                description="Last 24 hours"
                variant={((mockAnalytics.errored / mockAnalytics.total) * 100) > 5 ? "error" : "default"}
                trend={{ value: 0.7, positive: false }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnalyticsChart
                title="API Traffic"
                description="Requests and errors by hour"
                data={hourlyData}
                type="line"
                xKey="hour"
                dataKeys={[
                  { key: "requests", color: "#0BA5D3", name: "Requests" },
                  { key: "errors", color: "#F43F5E", name: "Errors" }
                ]}
                height={300}
              />
              <div className="md:col-span-1">
                <ErrorsTable
                  errors={mockAnalytics.topErrors}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="traffic" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalyticsChart
                title="API Requests"
                description="Requests by hour"
                data={hourlyData}
                type="bar"
                xKey="hour"
                dataKeys={[
                  { key: "requests", color: "#0BA5D3", name: "Requests" },
                ]}
                height={300}
              />
              <AnalyticsChart
                title="API Latency"
                description="Average latency in milliseconds"
                data={latencyData}
                type="line"
                xKey="hour"
                dataKeys={[
                  { key: "latency", color: "#F59E0B", name: "Latency (ms)" },
                ]}
                height={300}
              />
            </div>
          </TabsContent>

          <TabsContent value="errors" className="mt-4">
            <div className="grid grid-cols-1 gap-6">
              <AnalyticsChart
                title="Error Distribution"
                description="Errors by hour"
                data={hourlyData}
                type="bar"
                xKey="hour"
                dataKeys={[
                  { key: "errors", color: "#F43F5E", name: "Errors" },
                ]}
                height={300}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Error Breakdown</CardTitle>
                  <CardDescription>Breakdown of errors by type and frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Error Code</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead className="text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAnalytics.topErrors.map((error) => (
                        <TableRow key={error.code}>
                          <TableCell className="font-medium">{error.code}</TableCell>
                          <TableCell>{error.message}</TableCell>
                          <TableCell>{error.count.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            {((error.count / mockAnalytics.errored) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Endpoints</CardTitle>
                <CardDescription>Most frequently accessed API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Total Hits</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead className="text-right">Error Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAnalytics.topEndpoints.map((endpoint) => (
                      <TableRow key={`${endpoint.path}-${endpoint.method}`}>
                        <TableCell className="font-mono text-xs max-w-72 truncate">{endpoint.path}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              endpoint.method === "GET" ? "default" :
                              endpoint.method === "DELETE" ? "destructive" : "outline"
                            } 
                            className={`uppercase ${
                              endpoint.method === "POST" ? "bg-green-500" :
                              endpoint.method === "PUT" ? "bg-yellow-500" : ""
                            }`}
                          >
                            {endpoint.method}
                          </Badge>
                        </TableCell>
                        <TableCell>{endpoint.hits.toLocaleString()}</TableCell>
                        <TableCell>{endpoint.errors.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {((endpoint.errors / endpoint.hits) * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;

