import { Actions } from "@/molecules";

export const shipmentItemsColumns = (onEdit) => [
  {
    accessorKey: "bill_id",
    header: "BILL ID",
    cell: ({ row }) => <div>{row.original?.sale?.bill_id}</div>,
  },
  {
    accessorKey: "inventory",
    header: "Inventory",
    cell: ({ row }) => <div>{row.original?.sale?.inventory}</div>,
  },
  {
    accessorKey: "customer",
    header: "customer",
    cell: ({ row }) => (
      <div>
        {row.original?.sale?.customer?.name} (
        {row.original?.sale?.customer?.email})
      </div>
    ),
  },
  {
    accessorKey: "shipping address",
    header: "Shipping Address",
    cell: ({ row }) => <div>{row.original?.sale?.shipping_address}</div>,
  },
  {
    accessorKey: "adjustment",
    header: "Adjustment",
    cell: ({ row }) => <div>{row.original?.sale?.adjustment}</div>,
  },
  {
    accessorKey: "total price",
    header: "Total Price",
    cell: ({ row }) => <div>{row.original?.sale?.total_price}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.original?.sale?.status}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Actions row={row} onEdit={() => onEdit(row.original?.sale?.bill_id)} />
      );
    },
  },
];
