import { IShipment } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";
import moment from "moment";

export const shipmentColumns = (
  onPreview: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<IShipment>[] => [
  {
    accessorKey: "shipment_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shipment ID" className="" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("shipment_id")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "captain",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Captain" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.captain?.name}</div>
    ),
  },
  {
    accessorKey: "vehicle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehicle" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{`${row.original.vehicle?.make} ${row.original.vehicle?.model} ${row.original.vehicle?.year}`}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" className="" />
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
      <DataTableColumnHeader
        column={column}
        title="Shipment Date"
        className=""
      />
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
          row={row as Row<IShipment>}
          onPreview={() => onPreview(row.original.shipment_id)}
          onEdit={() => onEdit(row.original.shipment_id)}
          onDelete={() => onDelete(row.original.shipment_id)}
        />
      );
    },
  },
];
