/* eslint-disable react/prop-types */
import { DataTableSearchOption } from "@/atoms";
import {
  DataTableFilterOption,
  DataTablePagination,
  DataTableViewOptions,
  DateRangePicker,
} from "@/molecules";
import { Button } from "@/shadcn/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/components/ui/table";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

export const TransferDataTable = ({ columns, data }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const sourceInventories = [
    ...new Set(data.map((transfer) => transfer.source_inventory)),
  ];

  const destinationInventories = [
    ...new Set(data.map((transfer) => transfer.destination_inventory)),
  ];

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  // Apply the date range filter when date changes
  const handleDateSelect = ({ from, to }) => {
    setDateRange({ from, to });

    // Apply date range filter
    if (from && to) {
      table
        .getColumn("transfer_date")
        ?.setFilterValue([from.toISOString(), to.toISOString()]);
    } else {
      table.getColumn("transfer_date")?.setFilterValue(undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between py-4">
        <div className="flex">
          {table?.getColumn("trf_id") && (
            <DataTableSearchOption
              column={table.getColumn("trf_id")}
              label="TRF ID"
            />
          )}

          {table?.getColumn("source_inventory") && (
            <DataTableFilterOption
              column={table.getColumn("source_inventory")}
              label="source"
              options={sourceInventories}
            />
          )}

          {table?.getColumn("destination_inventory") && (
            <DataTableFilterOption
              column={table.getColumn("destination_inventory")}
              label="destination"
              options={destinationInventories}
            />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 justify-end">
          <DataTableViewOptions table={table} />
          {table?.getColumn("transfer_date") && (
            <DateRangePicker
              dateRange={dateRange}
              handleDateSelect={handleDateSelect}
            />
          )}
        </div>
      </div>

      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="px-4 py-2"
                      key={header.id}
                      // colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};
