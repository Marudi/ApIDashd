
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Check, Network, Plus, Search, Server, Shield, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockApis } from "@/lib/mock-data";
import { ApiDefinition } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const ApisList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter APIs based on search term
  const filteredApis = mockApis.filter(api => 
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.listenPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock Kong APIs
  const kongApis = [
    {
      id: "k1",
      name: "User Service API",
      listenPath: "/users",
      targetUrl: "http://user-service:8080",
      protocol: "http",
      active: true,
      authType: "jwt",
      lastUpdated: "2025-03-15T10:30:00Z",
      createdAt: "2025-01-15T10:30:00Z",
    },
    {
      id: "k2",
      name: "Product Catalog API",
      listenPath: "/products",
      targetUrl: "http://product-service:8081",
      protocol: "http",
      active: true,
      authType: "key-auth",
      lastUpdated: "2025-03-14T15:45:00Z",
      createdAt: "2025-01-14T15:45:00Z",
    },
    {
      id: "k3",
      name: "Payment Processing API",
      listenPath: "/payments",
      targetUrl: "http://payment-service:8082",
      protocol: "https",
      active: true,
      authType: "oauth2",
      lastUpdated: "2025-03-10T09:20:00Z",
      createdAt: "2025-01-10T09:20:00Z",
    },
    {
      id: "k4",
      name: "Analytics API",
      listenPath: "/analytics",
      targetUrl: "http://analytics-service:8083",
      protocol: "http",
      active: false,
      authType: "none",
      lastUpdated: "2025-02-28T11:15:00Z",
      createdAt: "2025-01-28T11:15:00Z",
    }
  ];

  const filteredKongApis = kongApis.filter(api => 
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.listenPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search APIs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/api-builder")}>
            <Plus className="mr-2 h-4 w-4" />
            New API
          </Button>
          <Button variant="outline" onClick={() => navigate("/gateway")}>
            <Server className="mr-2 h-4 w-4" />
            Tyk Gateway
          </Button>
          <Button variant="outline" onClick={() => navigate("/kong-gateway")}>
            <Network className="mr-2 h-4 w-4" />
            Kong Gateway
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tyk">
        <TabsList className="mb-4">
          <TabsTrigger value="tyk" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Tyk Gateway APIs
          </TabsTrigger>
          <TabsTrigger value="kong" className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            Kong Gateway APIs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tyk">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Listen Path</TableHead>
                    <TableHead>Target URL</TableHead>
                    <TableHead>Auth Type</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApis.map((api) => (
                    <ApiTableRow key={api.id} api={api} />
                  ))}
                </TableBody>
              </Table>

              {filteredApis.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No APIs found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kong">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Listen Path</TableHead>
                    <TableHead>Target URL</TableHead>
                    <TableHead>Auth Type</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKongApis.map((api) => (
                    <ApiTableRow key={api.id} api={api} />
                  ))}
                </TableBody>
              </Table>

              {filteredKongApis.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No Kong APIs found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

interface ApiTableRowProps {
  api: ApiDefinition;
}

const ApiTableRow = ({ api }: ApiTableRowProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TableRow>
      <TableCell className="text-center">
        {api.active ? (
          <Badge variant="default" className="w-8 justify-center bg-green-500">
            <Check className="h-3 w-3" />
          </Badge>
        ) : (
          <Badge variant="destructive" className="w-8 justify-center">
            <X className="h-3 w-3" />
          </Badge>
        )}
      </TableCell>
      <TableCell className="font-medium">{api.name}</TableCell>
      <TableCell className="font-mono text-xs">{api.listenPath}</TableCell>
      <TableCell className="max-w-44 truncate text-xs">{api.targetUrl}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {api.authType}
        </Badge>
      </TableCell>
      <TableCell className="text-xs">{formatDate(api.lastUpdated)}</TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm">View</Button>
      </TableCell>
    </TableRow>
  );
};

export default ApisList;
