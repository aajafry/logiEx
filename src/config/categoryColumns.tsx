import { ICategory } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";

export const categoryColumns = (
  onEdit: (name: string) => void,
  onDelete: (name: string) => void
): ColumnDef<ICategory>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row as Row<ICategory>}
          onEdit={() => onEdit(row.original.name)}
          onDelete={() => onDelete(row.original.name)}
        />
      );
    },
  },
];
