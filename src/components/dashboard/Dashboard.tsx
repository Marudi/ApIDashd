
import React from 'react';
import { Activity, Api, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ApiList } from "@/components/dashboard/ApiList";
import { ErrorsTable } from "@/components/dashboard/ErrorsTable";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { mockAnalytics, mockApis } from "@/lib/mock-data";

export const Dashboard: React.FC = () => {
  // Create some sample data for the analytics chart
  const trafficData = mockAnalytics.hourlyStats.map(stat => ({
    hour: `${stat.hour}:00`,
    requests: stat.requests,
    errors: stat.errors
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatusCard 
          title="Active APIs" 
          value="24" 
          icon={<Api className="h-5 w-5 text-muted-foreground" />} 
          trend={{ value: 12, positive: true }} 
        />
        <StatusCard 
          title="API Calls" 
          value="1.2M" 
          icon={<Activity className="h-5 w-5 text-muted-foreground" />} 
          trend={{ value: 8, positive: true }} 
        />
        <StatusCard 
          title="Error Rate" 
          value="0.8%" 
          icon={<AlertTriangle className="h-5 w-5 text-muted-foreground" />} 
          trend={{ value: 3, positive: false }} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>API Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              title="API Traffic"
              description="Requests and errors by hour"
              data={trafficData}
              type="line"
              xKey="hour"
              dataKeys={[
                { key: "requests", color: "#0BA5D3", name: "Requests" },
                { key: "errors", color: "#F43F5E", name: "Errors" }
              ]}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorsTable errors={mockAnalytics.topErrors} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your APIs</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiList apis={mockApis} />
        </CardContent>
      </Card>
    </div>
  );
};
