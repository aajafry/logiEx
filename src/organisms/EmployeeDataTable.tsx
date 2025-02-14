import { DataTableBody, DataTableSearchOption } from "@/atoms";
import { IEmployee } from "@/interfaces";
import {
  DataTableFilterOption,
  DataTablePagination,
  DataTableViewOptions,
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
  SortingState,
  ColumnFiltersState,
  useReactTable,
  Column,
  ColumnDef,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

export const EmployeeDataTable = ({
  columns,
  data,
}: {
  columns: ColumnDef<IEmployee>[];
  data: IEmployee[];
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

  const roles = useMemo(() => {
    return table.getColumn("role")
      ? [...new Set(data.map((employee) => employee.role))]
      : [];
  }, [data, table]);

  const handleResetFilters = useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between py-4">
        <div className="flex">
          {table?.getColumn("email") && (
            <DataTableSearchOption
              column={table.getColumn("email") as Column<IEmployee, unknown>}
              label="email"
            />
          )}

          {table?.getColumn("role") && (
            <DataTableFilterOption
              column={table.getColumn("role")}
              label="role"
              options={roles}
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
        </div>
      </div>

      <div className="overflow-y-auto rounded-md border">
        <DataTableBody table={table} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};
