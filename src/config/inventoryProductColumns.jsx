import { DataTableColumnHeader } from "@/molecules";

export const inventoryProductColumns = () => [
  {
    accessorKey: "mr_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MR ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("mr_id")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("product")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => <div>{row.getValue("quantity")} units</div>,
  },
];
