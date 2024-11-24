import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import moment from "moment";

export const shipmentColumns = (onPreview, onEdit, onDelete) => [
  {
    accessorKey: "shipment_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shipment ID" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("shipment_id")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "captain",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Captain" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.captain?.name}</div>
    ),
  },
  {
    accessorKey: "vehicle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehicle" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{`${row.original.vehicle?.make} ${row.original.vehicle?.model} ${row.original.vehicle?.year}`}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "shipment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shipment Date" />
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.shipment_date).format("YYYY-MMM-DD")}</div>
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
          onPreview={() => onPreview(row.original.shipment_id)}
          onEdit={() => onEdit(row.original.shipment_id)}
          onDelete={() => onDelete(row.original.shipment_id)}
        />
      );
    },
  },
];
