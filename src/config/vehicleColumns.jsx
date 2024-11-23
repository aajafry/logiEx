import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";

export const vehicleColumns = (onEdit, onDelete) => [
  {
    accessorKey: "make",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => {
      const brandName = `${row.original?.make} ${row.original?.model} ${row.original?.year}`;
      return <div className="capitalize">{brandName}</div>;
    },
  },
  {
    accessorKey: "vin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="VIN" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("vin")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "plate_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plate No" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("plate_number")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "cargo_capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("cargo_capacity")} kg</div>
    ),
  },
  {
    accessorKey: "mileage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mileage" />
    ),
    cell: ({ row }) => <div>{row.getValue("mileage")} km/h</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const brandName = `${row.original?.make} ${row.original?.model} ${row.original?.year}`;
      return (
        <DataTableRowActions
          row={row}
          onEdit={() => onEdit(row.original.vin)}
          onDelete={() => onDelete(row.original.vin, brandName)}
        />
      );
    },
  },
];
