import { DataTableBody, DataTableSearchOption } from "@/atoms";
import { IProduct } from "@/interfaces";
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

export const ProductDataTable = ({
  columns,
  data,
}: {
  columns: ColumnDef<IProduct>[];
  data: IProduct[];
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

  const categories = useMemo(
    () => [...new Set(data.map((product) => product.category))],
    [data]
  );

  const handleResetFilters = useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between py-4">
        <div className="flex">
          {table?.getColumn("name") && (
            <DataTableSearchOption
              column={table.getColumn("name") as Column<IProduct, unknown>}
              label="name"
            />
          )}

          {table?.getColumn("category") && (
            <DataTableFilterOption
              column={table.getColumn("category")}
              label="category"
              options={categories}
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
