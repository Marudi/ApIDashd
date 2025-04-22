
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { ApiDefinition } from "@/lib/types";

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
        <Button variant="outline" size="sm" asChild>
          <Link to={`/apis/${api.id}`}>View</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ApiTableRow;
