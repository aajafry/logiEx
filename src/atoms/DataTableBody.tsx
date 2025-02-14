import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/components/ui/table";
import { flexRender, Table as TanstackTable } from "@tanstack/react-table";

type PropsType<TData> = {
  table: TanstackTable<TData>;
};

export const DataTableBody = <TData,>({ table }: PropsType<TData>) => {
  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel();
  const columnCount = headerGroups.length
    ? headerGroups[0].headers.length
    : table.getAllColumns().length || 1;

  return (
    <Table>
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className="px-4 py-2"
                key={header.id}
                colSpan={header.colSpan}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rowModel.rows.length ? (
          rowModel.rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell className="px-4 py-2" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnCount} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
