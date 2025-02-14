import { ISupervisor } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";
import moment from "moment";

export const supervisorColumns = (
  onEdit: (id: string) => void,
  onDelete: (id: string, name: string, inventory: string) => void
): ColumnDef<ISupervisor>[] => [
  {
    accessorKey: "employee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.employee?.name}</div>
    ),
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.inventory}</div>
    ),
  },
  {
    accessorKey: "hire_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hire Date" className="" />
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.hire_date).format("YYYY-MMM-DD")}</div>
    ),
  },
  {
    accessorKey: "termination_date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Termination Date"
        className=""
      />
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
      <DataTableColumnHeader column={column} title="Resign Date" className="" />
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
      <DataTableColumnHeader
        column={column}
        title="Transfer Date"
        className=""
      />
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
          row={row as Row<ISupervisor>}
          onEdit={() => onEdit(row.original.id)}
          onDelete={() =>
            onDelete(
              row.original.id,
              row.original.employee?.name || "",
              row.original.inventory,
            )
          }
        />
      );
    },
  },
];
