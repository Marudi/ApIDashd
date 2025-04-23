
import { Activity, BarChart3, Key, Server, Shield, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ApiList } from "@/components/dashboard/ApiList";
import { ErrorsTable } from "@/components/dashboard/ErrorsTable";
import { mockAnalytics, mockApis, mockSystemHealth } from "@/lib/mock-data";
import { useDemoData } from "@/contexts/DemoDataContext";

const Index = () => {
  const { showDemoData } = useDemoData();

  // If demo data is disabled, show empty placeholders
  if (!showDemoData) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">Demo Data Disabled</h2>
          <p className="text-muted-foreground mb-6">
            You've disabled demo data in settings. Connect to a real API gateway 
            or enable demo data in Settings to view dashboard content.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Format the hourly data for the chart
  const hourlyData = mockAnalytics.hourlyStats.map(stat => ({
    hour: `${stat.hour}:00`,
    requests: stat.requests,
    errors: stat.errors,
    latency: stat.latency,
  }));

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Total Requests"
          value={mockAnalytics.total.toLocaleString()}
          description="Last 24 hours"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 8.2, positive: true }}
        />
        <StatusCard
          title="Success Rate"
          value={`${((mockAnalytics.successful / mockAnalytics.total) * 100).toFixed(1)}%`}
          description="Last 24 hours"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          variant="success"
          trend={{ value: 1.5, positive: true }}
        />
        <StatusCard
          title="Avg. Latency"
          value={`${mockAnalytics.avgLatency}ms`}
          description="Last 24 hours"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          variant={mockAnalytics.avgLatency > 150 ? "warning" : "default"}
          trend={{ value: 3.1, positive: false }}
        />
        <StatusCard
          title="Active APIs"
          value={mockApis.filter(api => api.active).length}
          description={`Out of ${mockApis.length} total`}
          icon={<Server className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          height={250}
        />
        <ErrorsTable
          errors={mockAnalytics.topErrors}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApiList apis={mockApis} limit={3} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusCard
            title="Gateway Status"
            value={mockSystemHealth.gatewayStatus === "healthy" ? "Healthy" : "Warning"}
            description={`v${mockSystemHealth.gatewayVersion}`}
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            variant={mockSystemHealth.gatewayStatus === "healthy" ? "success" : "warning"}
          />
          <StatusCard
            title="CPU Usage"
            value={`${mockSystemHealth.cpuUsage}%`}
            icon={<Server className="h-4 w-4 text-muted-foreground" />}
            variant={mockSystemHealth.cpuUsage > 75 ? "warning" : "default"}
          />
          <StatusCard
            title="Requests/sec"
            value={mockSystemHealth.requestsPerSecond.toFixed(1)}
            icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          />
          <StatusCard
            title="Memory Usage"
            value={`${mockSystemHealth.memoryUsage}%`}
            icon={<Server className="h-4 w-4 text-muted-foreground" />}
            variant={mockSystemHealth.memoryUsage > 80 ? "warning" : "default"}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
