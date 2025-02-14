import {
  ICategory,
  ICustomer,
  IEmployee,
  IInventory,
  IProduct,
  IPurchase,
  ISale,
  IShipment,
  IShipmentProduct,
  ISupervisor,
  ITransfer,
  IVehicle,
  IVendor,
} from "@/interfaces";
import { Button } from "@/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const DataTableRowActions = ({
  row,
  onPreview,
  onEdit,
  onDelete,
}: {
  row: Row<
    | ICategory
    | ICustomer
    | IEmployee
    | IInventory
    | IProduct
    | ISale
    | IShipment
    | ISupervisor
    | ITransfer
    | IVehicle
    | IVendor
    | IPurchase
    | IShipmentProduct
  >;
  onPreview?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(row.original.id)}
        >
          Make as Copy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {onPreview && (
          <DropdownMenuItem onClick={onPreview}>Preview</DropdownMenuItem>
        )}
        {onEdit && <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
