import { Actions } from "@/molecules";
import moment from "moment";

export const salesColumns = (
  // onPreview,
  onEdit,
  onDelete
) => [
  {
    accessorKey: "bill_id",
    header: "BILL ID",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("bill_id")}</div>
    ),
  },
  {
    accessorKey: "inventory",
    header: "Inventory",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("inventory")}</div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.customer?.name}</div>
    ),
  },
  {
    accessorKey: "shipping_address",
    header: "Address",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("shipping_address")}</div>
    ),
  },
  {
    accessorKey: "adjustment",
    header: () => <div className="text-right">Adjustment</div>,
    cell: ({ row }) => {
      const adjustment = parseFloat(row.getValue("adjustment"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(adjustment);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "total_price",
    header: () => <div className="text-right">Total Price</div>,
    cell: ({ row }) => {
      const totalPrice = parseFloat(row.getValue("total_price"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(totalPrice);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "sale_date",
    header: "Sale Date",
    cell: ({ row }) => (
      <div>{moment(row.original.sale_date).format("YYYY-MMM-DD")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Actions
          row={row}
          // onPreview={() => onPreview(row.original.bill_id)}
          onEdit={() => onEdit(row.original.bill_id)}
          onDelete={() => onDelete(row.original.bill_id)}
        />
      );
    },
  },
];
