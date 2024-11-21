import { Actions } from "@/molecules";
import moment from "moment";

export const transferColumns = (
  // onPreview, 
  onEdit, 
  onDelete
) => [
  {
    accessorKey: "trf_id",
    header: "TRF ID",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("trf_id")}</div>
    ),
  },
  {
    accessorKey: "source_inventory",
    header: "Source",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("source_inventory")}</div>
    ),
  },
  {
    accessorKey: "destination_inventory",
    header: "Destination",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("destination_inventory")}</div>
    ),
  },
  {
    accessorKey: "transfer_date",
    header: "Transfer Date",
    cell: ({ row }) => (
      <div>{moment(row.original.transfer_date).format("YYYY-MMM-DD")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Actions
          row={row}
          // onPreview={() => onPreview(row.original.trf_id)}
          onEdit={() => onEdit(row.original.trf_id)}
          onDelete={() => onDelete(row.original.trf_id)}
        />
      );
    },
  },
];
