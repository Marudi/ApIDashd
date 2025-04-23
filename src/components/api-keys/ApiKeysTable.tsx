
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ApiKey } from "@/lib/types";
import { ApiKeyTableRow } from "./ApiKeyTableRow";

interface ApiKeysTableProps {
  keys: ApiKey[];
  onRevoke: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onUpdateExpiration: (id: string, expirationDate: string | undefined) => void;
}

export const ApiKeysTable = ({ 
  keys, 
  onRevoke, 
  onToggleActive, 
  onUpdateExpiration 
}: ApiKeysTableProps) => {
  return (
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
            {keys.map((key) => (
              <ApiKeyTableRow 
                key={key.id} 
                apiKey={key} 
                onRevoke={onRevoke}
                onToggleActive={onToggleActive}
                onUpdateExpiration={onUpdateExpiration}
              />
            ))}
          </TableBody>
        </Table>

        {keys.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No API keys found matching your search criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
