/* eslint-disable react/prop-types */
import { Button } from "@/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const Actions = ({ row, onPreview, onEdit, onDelete }) => {
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
