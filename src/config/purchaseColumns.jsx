import { Actions } from "@/molecules";
import moment from "moment";

export const purchaseColumns = (
  // onPreview,
  onEdit,
  onDelete
) => [
  {
    accessorKey: "mr_id",
    header: "MR ID",
    cell: ({ row }) => <div className="uppercase">{row.getValue("mr_id")}</div>,
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("vendor")}</div>
    ),
  },
  {
    accessorKey: "inventory",
    header: "Inventory",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("inventory")}</div>
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
    accessorKey: "purchase_date",
    header: "Purchase Date",
    cell: ({ row }) => (
      <div>{moment(row.original.purchase_date).format("YYYY-MMM-DD")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Actions
          row={row}
          // onPreview={() => onPreview(row.original.mr_id)}
          onEdit={() => onEdit(row.original.mr_id)}
          onDelete={() => onDelete(row.original.mr_id)}
        />
      );
    },
  },
];
