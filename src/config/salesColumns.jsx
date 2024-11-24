import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import moment from "moment";

export const salesColumns = (onEdit, onDelete) => [
  {
    accessorKey: "bill_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="BILL ID" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("bill_id")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("inventory")}</div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.customer?.name}</div>
    ),
  },
  {
    accessorKey: "shipping_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("shipping_address")}</div>
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Price"
        className="justify-end"
      />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "sale_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sale Date" />
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.sale_date).format("YYYY-MMM-DD")}</div>
    ),
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row}
          onEdit={() => onEdit(row.original.bill_id)}
          onDelete={() => onDelete(row.original.bill_id)}
        />
      );
    },
  },
];
