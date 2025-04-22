
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Key, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockApiKeys, mockPolicies } from "@/lib/mock-data";
import { ApiKey } from "@/lib/types";

const ApiKeys = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter API keys based on search term
  const filteredKeys = mockApiKeys.filter(key => 
    // Only search by policy name since keys don't have names
    key.policyId ? getPolicyName(key.policyId).toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search API keys..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Hash</TableHead>
                <TableHead>Policy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.map((key) => (
                <ApiKeyTableRow key={key.id} apiKey={key} />
              ))}
            </TableBody>
          </Table>

          {filteredKeys.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No API keys found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

// Helper function to get policy name from policy ID
const getPolicyName = (policyId: string) => {
  const policy = mockPolicies.find(p => p.id === policyId);
  return policy ? policy.name : "Unknown Policy";
};

interface ApiKeyTableRowProps {
  apiKey: ApiKey;
}

const ApiKeyTableRow = ({ apiKey }: ApiKeyTableRowProps) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Generate a masked key for display
  const maskedKey = apiKey.keyHash.slice(0, 8) + "..." + apiKey.keyHash.slice(-8);

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          {maskedKey}
        </div>
      </TableCell>
      <TableCell>
        {apiKey.policyId ? (
          <Badge variant="outline">{getPolicyName(apiKey.policyId)}</Badge>
        ) : (
          <span className="text-muted-foreground">No policy</span>
        )}
      </TableCell>
      <TableCell>
        <Badge 
          variant={apiKey.status === "active" ? "default" : "destructive"}
          className={apiKey.status === "active" ? "bg-green-500" : ""}
        >
          {apiKey.status}
        </Badge>
      </TableCell>
      <TableCell className="text-xs">{formatDate(apiKey.createdAt)}</TableCell>
      <TableCell className="text-xs">
        {apiKey.expires ? formatDate(apiKey.expires) : "Never"}
      </TableCell>
      <TableCell className="text-xs">
        {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : "Never"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="destructive" size="sm">Revoke</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ApiKeys;
