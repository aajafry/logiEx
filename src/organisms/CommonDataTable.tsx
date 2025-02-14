import { DataTableBody, DataTableSearchOption } from "@/atoms";
import { DataTablePagination, DataTableViewOptions } from "@/molecules";
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
import { FC, useState } from "react";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";

type PropsTypes = {
  columns: ColumnDef<any>[];
  data: any[];
  searchColumn: string;
};

export const CommonDataTable: FC<PropsTypes> = ({
  columns,
  data,
  searchColumn,
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

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between py-4">
        <div className="flex">
          {table?.getColumn(`${searchColumn}`) && (
            <DataTableSearchOption
              column={
                table.getColumn(`${searchColumn}`) as Column<object, unknown>
              }
              label={searchColumn}
            />
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
