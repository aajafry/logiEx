import { Button } from "@/shadcn/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const inventoryProductColumns = () => [
  {
    accessorKey: "mr_id",
    header: "MR ID",
    cell: ({ row }) => <div>{row.getValue("mr_id")}</div>,
  },
  {
    accessorKey: "product",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("product")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.getValue("quantity")} units</div>,
  },
];
