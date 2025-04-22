
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Check, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPolicies, mockApis } from "@/lib/mock-data";
import { Policy } from "@/lib/types";

const Policies = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter policies based on search term
  const filteredPolicies = mockPolicies.filter(policy => 
    policy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>APIs</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead>Quota</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <PolicyTableRow key={policy.id} policy={policy} />
              ))}
            </TableBody>
          </Table>

          {filteredPolicies.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No policies found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

interface PolicyTableRowProps {
  policy: Policy;
}

const PolicyTableRow = ({ policy }: PolicyTableRowProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get API names for the policy
  const apiNames = policy.apis.map(apiId => {
    const api = mockApis.find(a => a.id === apiId);
    return api ? api.name : "Unknown API";
  });

  return (
    <TableRow>
      <TableCell className="text-center">
        {policy.active ? (
          <Badge variant="default" className="w-8 justify-center bg-green-500">
            <Check className="h-3 w-3" />
          </Badge>
        ) : (
          <Badge variant="destructive" className="w-8 justify-center">
            <X className="h-3 w-3" />
          </Badge>
        )}
      </TableCell>
      <TableCell className="font-medium">{policy.name}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {apiNames.map((name, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {name}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        {policy.rateLimit?.enabled ? (
          <span>{policy.rateLimit.rate} per {policy.rateLimit.per}s</span>
        ) : (
          <span className="text-muted-foreground">None</span>
        )}
      </TableCell>
      <TableCell>
        {policy.quota?.enabled ? (
          <span>{policy.quota.max.toLocaleString()} / {policy.quota.per / 86400}d</span>
        ) : (
          <span className="text-muted-foreground">None</span>
        )}
      </TableCell>
      <TableCell className="text-xs">{formatDate(policy.lastUpdated)}</TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm">View</Button>
      </TableCell>
    </TableRow>
  );
};

export default Policies;
