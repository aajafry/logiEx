import { IEmployee } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";

export const employeeColumns = (
  onEdit: (id: string) => void,
  onDelete: (id: string, name: string) => void
): ColumnDef<IEmployee>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" className="" />
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" className="" />
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" className="" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("address")}</div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row as Row<IEmployee>}
          onEdit={() => onEdit(row.original.id)}
          onDelete={() => onDelete(row.original.id, row.original.name)}
        />
      );
    },
  },
];
