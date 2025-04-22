
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ApiList } from "@/components/dashboard/ApiList";
import { ErrorsTable } from "@/components/dashboard/ErrorsTable";
import { StatusCard } from "@/components/dashboard/StatusCard";

export const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatusCard title="Active APIs" value="24" icon="api" trend="up" percentage="12" />
        <StatusCard title="API Calls" value="1.2M" icon="activity" trend="up" percentage="8" />
        <StatusCard title="Error Rate" value="0.8%" icon="alert-triangle" trend="down" percentage="3" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>API Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorsTable />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your APIs</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiList />
        </CardContent>
      </Card>
    </div>
  );
};
