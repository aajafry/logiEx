import { IVehicle } from "@/interfaces";
import { DataTableColumnHeader, DataTableRowActions } from "@/molecules";
import { ColumnDef, Row } from "@tanstack/react-table";

export const vehicleColumns = (
  onEdit: (vin: string) => void,
  onDelete: (vin: string, name: string) => void
): ColumnDef<IVehicle>[] => [
  {
    accessorKey: "make",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" className="" />
    ),
    cell: ({ row }) => {
      const brandName = `${row.original?.make} ${row.original?.model} ${row.original?.year}`;
      return <div className="capitalize">{brandName}</div>;
    },
  },
  {
    accessorKey: "vin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="VIN" className="" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("vin")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" className="" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "plate_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plate No" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("plate_number")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "cargo_capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" className="" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("cargo_capacity")} kg</div>
    ),
  },
  {
    accessorKey: "mileage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mileage" className="" />
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
          row={row as Row<IVehicle>}
          onEdit={() => onEdit(row.original.vin)}
          onDelete={() => onDelete(row.original.vin, brandName)}
        />
      );
    },
  },
];
