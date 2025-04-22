
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ErrorEntry {
  code: number;
  count: number;
  message: string;
}

interface ErrorsTableProps {
  errors: ErrorEntry[];
  title?: string;
  description?: string;
}

export function ErrorsTable({ 
  errors, 
  title = "Top Errors", 
  description = "Most frequent API errors in the last 24 hours"
}: ErrorsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Error Code</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((error) => (
              <TableRow key={error.code}>
                <TableCell className="font-medium">{error.code}</TableCell>
                <TableCell>{error.message}</TableCell>
                <TableCell className="text-right">{error.count.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
