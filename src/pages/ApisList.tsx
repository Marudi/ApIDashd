import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Search, Server, Network } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockApis } from "@/lib/mock-data";
import { kongApis } from "@/lib/mock-apis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import ApiTableRow from "@/components/apis/ApiTableRow";
import ApiExportImport from "@/components/apis/ApiExportImport";

const ApisList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tykApiData, setTykApiData] = useState(mockApis);
  const [kongApiData, setKongApiData] = useState(kongApis);

  const navigate = useNavigate();

  // Filter APIs based on search term
  const filteredApis = tykApiData.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.listenPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKongApis = kongApiData.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.listenPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle import for active tab (for simplicity we import to both)
  const handleImport = (importedApis: any[]) => {
    // Detect by protocol to split Tyk/Kong APIs (simple mock logic)
    const tyk = importedApis.filter(api => api.protocol && (api.protocol === "http" || api.protocol === "https"));
    const kong = importedApis.filter(api => api.protocol && (api.protocol === "grpc" || api.protocol === "grpcs" || api.protocol === "tcp" || api.protocol === "tls" || api.protocol === "udp"));
    // For this mock, merge/override by id
    setTykApiData((prev) => {
      const ids = new Set(tyk.map(api => api.id));
      return [
        ...prev.filter(api => !ids.has(api.id)),
        ...tyk,
      ];
    });
    setKongApiData((prev) => {
      const ids = new Set(kong.map(api => api.id));
      return [
        ...prev.filter(api => !ids.has(api.id)),
        ...kong,
      ];
    });
  };

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

      <ApiExportImport apis={[...tykApiData, ...kongApiData]} onImport={handleImport} />

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

export default ApisList;
