import { DataTableBody, DataTableSearchOption } from "@/atoms";
import {
  DataTableFilterOption,
  DataTablePagination,
  DataTableViewOptions,
} from "@/molecules";
import { Button } from "@/shadcn/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { IVehicle } from "@/interfaces";

export const VehicleDataTable = ({
  columns,
  data,
}: {
  columns: ColumnDef<IVehicle>[];
  data: IVehicle[];
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

  const types = useMemo(
    () => [...new Set(data.map((vehicle) => vehicle.type))],
    [data]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between py-4">
        <div className="flex">
          {table?.getColumn("vin") && (
            <DataTableSearchOption
              column={table.getColumn("vin") as Column<IVehicle, unknown>}
              label="vin"
            />
          )}

          {table?.getColumn("type") && (
            <DataTableFilterOption
              column={table.getColumn("type")}
              label="type"
              options={types}
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
        </div>
      </div>

      <div className="overflow-y-auto rounded-md border">
        <DataTableBody table={table} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};
