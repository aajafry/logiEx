import { ITransfer } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";
import moment from "moment";

export const transferColumns = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<ITransfer>[] => [
  {
    accessorKey: "trf_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TRF ID" className="" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("trf_id")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "source_inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("source_inventory")}</div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "destination_inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("destination_inventory")}</div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
      <div>{moment(row.original.transfer_date).format("YYYY-MMM-DD")}</div>
    ),
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row as Row<ITransfer>}
          onEdit={() => onEdit(row.original.trf_id)}
          onDelete={() => onDelete(row.original.trf_id)}
        />
      );
    },
  },
];
