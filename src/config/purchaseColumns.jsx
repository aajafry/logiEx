import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import moment from "moment";

export const purchaseColumns = (onEdit, onDelete) => [
  {
    accessorKey: "mr_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MR ID" />
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("mr_id")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "vendor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("vendor")}</div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("inventory")}</div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    accessorKey: "purchase_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Date" />
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.purchase_date).format("YYYY-MMM-DD")}</div>
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
          onEdit={() => onEdit(row.original.mr_id)}
          onDelete={() => onDelete(row.original.mr_id)}
        />
      );
    },
  },
];
