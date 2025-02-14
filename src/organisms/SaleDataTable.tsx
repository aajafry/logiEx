/* eslint-disable react/prop-types */
import { DataTableBody, DataTableSearchOption } from "@/atoms";
import { ISale } from "@/interfaces";
import {
  DataTableFilterOption,
  DataTablePagination,
  DataTableViewOptions,
  DateRangePicker,
} from "@/molecules";
import { Button } from "@/shadcn/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  Column,
  ColumnDef,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

export const SaleDataTable = ({
  columns,
  data,
}: {
  columns: ColumnDef<ISale>[];
  data: ISale[];
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
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
    enableRowSelection: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const status = useMemo(
    () => [...new Set(data.map((sale) => sale.status))],
    [data]
  );

  const inventories = useMemo(
    () => [...new Set(data.map((sale) => sale.inventory))],
    [data]
  );

  const handleResetFilters = useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  // Apply the date range filter when date changes
  const handleDateSelect = (range: DateRange | undefined) => {
    const { from, to } = range || { from: undefined, to: undefined };
    setDateRange({ from: from || new Date(), to: to || new Date() });

    // Apply date range filter
    if (from && to) {
      table
        .getColumn("sale_date")
        ?.setFilterValue([from.toISOString(), to.toISOString()]);
    } else {
      table.getColumn("sale_date")?.setFilterValue(undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between py-4">
        <div className="flex">
          {table?.getColumn("bill_id") && (
            <DataTableSearchOption
              column={table.getColumn("bill_id") as Column<ISale, unknown>}
              label="BILL ID"
            />
          )}

          {table?.getColumn("inventory") && (
            <DataTableFilterOption
              column={table.getColumn("inventory")}
              label="inventory"
              options={inventories}
            />
          )}

          {table?.getColumn("status") && (
            <DataTableFilterOption
              column={table.getColumn("status")}
              label="status"
              options={status}
            />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 justify-end">
          <DataTableViewOptions table={table} />
          {table?.getColumn("sale_date") && (
            <DateRangePicker
              dateRange={dateRange}
              handleDateSelect={handleDateSelect}
            />
          )}
        </div>
      </div>

      <div className="overflow-y-auto rounded-md border">
        <DataTableBody table={table} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};
