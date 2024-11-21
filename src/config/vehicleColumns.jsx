import { Actions } from "@/molecules";
import { Button } from "@/shadcn/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const vehicleColumns = (onEdit, onDelete) => [
  {
    accessorKey: "make",
    header: "Brand",
    cell: ({ row }) => {
      const brandName = `${row.original?.make} ${row.original?.model} ${row.original?.year}`;
      return <div className="capitalize">{brandName}</div>;
    },
  },
  {
    accessorKey: "vin",
    header: "VIN",
    cell: ({ row }) => <div className="capitalize">{row.getValue("vin")}</div>,
  },
  {
    accessorKey: "plate_number",
    header: "Plate No",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("plate_number")}</div>
    ),
  },
  {
    accessorKey: "cargo_capacity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Capacity
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("cargo_capacity")} kg</div>
    ),
  },
  {
    accessorKey: "mileage",
    header: "Mileage",
    cell: ({ row }) => (
      <div>{row.getValue("mileage")} km/h</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const brandName = `${row.original?.make} ${row.original?.model} ${row.original?.year}`;
      return (
        <Actions
          row={row}
          onEdit={() => onEdit(row.original.vin)}
          onDelete={() => onDelete(row.original.vin, brandName)}
        />
      );
    },
  },
];
