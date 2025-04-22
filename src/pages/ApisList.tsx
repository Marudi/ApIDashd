
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Check, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockApis } from "@/lib/mock-data";
import { ApiDefinition } from "@/lib/types";

const ApisList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter APIs based on search term
  const filteredApis = mockApis.filter(api => 
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New API
        </Button>
      </div>

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
