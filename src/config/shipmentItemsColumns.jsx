import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";

export const shipmentItemsColumns = (onEdit) => [
  {
    accessorKey: "bill_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="BILL ID" />
    ),
    cell: ({ row }) => <div>{row.original?.sale?.bill_id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory" />
    ),
    cell: ({ row }) => <div>{row.original?.sale?.inventory}</div>,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
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
      <DataTableColumnHeader column={column} title="Address" />
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
      const adjustment = parseFloat(row.original?.sale?.adjustment);

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
      const totalPrice = parseFloat(row.original?.sale?.total_price);

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
      <DataTableColumnHeader column={column} title="Status" />
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
          row={row}
          onEdit={() => onEdit(row.original?.sale?.bill_id)}
        />
      );
    },
  },
];
