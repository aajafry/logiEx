import { IInventoryProduct } from "@/interfaces";
import { DataTableColumnHeader } from "@/molecules";
import { ColumnDef } from "@tanstack/react-table";

export const inventoryProductColumns = (): ColumnDef<IInventoryProduct>[] => [
  {
    accessorKey: "mr_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MR ID" className="" />
    ),
    cell: ({ row }) => <div>{row.getValue("mr_id")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("product")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" className="" />
    ),
    cell: ({ row }) => <div>{row.getValue("quantity")} units</div>,
  },
];
