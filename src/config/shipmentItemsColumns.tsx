import { IShipmentProduct } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";

export const shipmentItemsColumns = (
  onEdit: (id: string) => void
): ColumnDef<IShipmentProduct>[] => [
  {
    accessorKey: "bill_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="BILL ID" className="" />
    ),
    cell: ({ row }) => <div>{row.original?.sale?.bill_id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory" className="" />
    ),
    cell: ({ row }) => <div>{row.original?.sale?.inventory}</div>,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" className="" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original?.sale?.customer?.name} (
        {row.original?.sale?.customer?.email})
      </div>
    ),
  },
  {
    accessorKey: "shipping address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" className="" />
    ),
    cell: ({ row }) => <div>{row.original?.sale?.shipping_address}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "adjustment",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Adjustment"
        className="justify-end"
      />
    ),
    cell: ({ row }) => {
      const adjustment = parseFloat(
        row.original?.sale?.adjustment?.toString() || "0"
      );

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(adjustment);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "total price",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Price"
        className="justify-end"
      />
    ),
    cell: ({ row }) => {
      const totalPrice = parseFloat(row.original?.sale?.total_price ?? "0");

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original?.sale?.status}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row as Row<IShipmentProduct>}
          onEdit={() => onEdit(row.original?.sale?.bill_id ?? "")}
        />
      );
    },
  },
];
