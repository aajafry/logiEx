import { IProduct } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";

export const productColumns = (
  onEdit: (name: string) => void,
  onDelete: (name: string) => void
): ColumnDef<IProduct>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Price"
        className=" justify-end"
      />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" className="" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("sku")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row as Row<IProduct>}
          onEdit={() => onEdit(row.original.name)}
          onDelete={() => onDelete(row.original.name)}
        />
      );
    },
  },
];
