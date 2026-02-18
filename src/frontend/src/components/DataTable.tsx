import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Column {
  key: string;
  label: string;
  format?: (value: any, row?: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
}

export default function DataTable({ data, columns }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead key={column.key} className="font-semibold">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex} className="hover:bg-muted/30 transition-colors">
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.format ? column.format(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
