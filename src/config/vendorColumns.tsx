import { IVendor } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";

export const vendorColumns = (
  onEdit: (name: string) => void,
  onDelete: (name: string) => void
): ColumnDef<IVendor>[] => [
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
          row={row as Row<IVendor>}
          onEdit={() => onEdit(row.original.name)}
          onDelete={() => onDelete(row.original.name)}
        />
      );
    },
  },
];
