import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import moment from "moment";

export const supervisorColumns = (onEdit, onDelete) => [
  {
    accessorKey: "employee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.employee?.name}</div>
    ),
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.inventory}</div>
    ),
  },
  {
    accessorKey: "hire_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hire Date" />
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.hire_date).format("YYYY-MMM-DD")}</div>
    ),
  },
  {
    accessorKey: "termination_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Termination Date" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.termination_date
          ? moment(row.original.termination_date).format("YYYY-MMM-DD")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "resign_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resign Date" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.resign_date
          ? moment(row.original.resign_date).format("YYYY-MMM-DD")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "transfer_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transfer Date" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.transfer_date
          ? moment(row.original.transfer_date).format("YYYY-MMM-DD")
          : "N/A"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row}
          onEdit={() => onEdit(row.original.id)}
          onDelete={() =>
            onDelete(
              row.original.id,
              row.original.employee?.name,
              row.original.inventory
            )
          }
        />
      );
    },
  },
];
