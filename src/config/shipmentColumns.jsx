import { Actions } from "@/molecules";
import moment from "moment";

export const shipmentColumns = (
  onPreview, 
  onEdit,
   onDelete
  ) => [
  {
    accessorKey: "shipment_id",
    header: "Shipment ID",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("shipment_id")}</div>
    ),
  },
  {
    accessorKey: "captain",
    header: "Captain",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.captain?.name}</div>
    ),
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => (
      <div className="capitalize">{`${row.original.vehicle?.make} ${row.original.vehicle?.model} ${row.original.vehicle?.year}`}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "shipment_date",
    header: "Shipment Date",
    cell: ({ row }) => (
      <div>{moment(row.original.shipment_date).format("YYYY-MMM-DD")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Actions
          row={row}
          onPreview={() => onPreview(row.original.shipment_id)}
          onEdit={() => onEdit(row.original.shipment_id)}
          onDelete={() => onDelete(row.original.shipment_id)}
        />
      );
    },
  },
];
