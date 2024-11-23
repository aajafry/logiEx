import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import moment from "moment";

export const transferColumns = (onEdit, onDelete) => [
  {
    accessorKey: "trf_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TRF ID" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("trf_id")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "source_inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("source_inventory")}</div>
    ),
  },
  {
    accessorKey: "destination_inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("destination_inventory")}</div>
    ),
  },
  {
    accessorKey: "transfer_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transfer Date" />
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
          row={row}
          onEdit={() => onEdit(row.original.trf_id)}
          onDelete={() => onDelete(row.original.trf_id)}
        />
      );
    },
  },
];
