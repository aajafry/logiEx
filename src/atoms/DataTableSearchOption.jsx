/* eslint-disable react/prop-types */

import { Input } from "@/shadcn/components/ui/input";

export const DataTableSearchOption = ({ label, column }) => {
  return (
    <Input
      placeholder={`Filter ${label}s...`}
      value={column?.getFilterValue() ?? ""}
      onChange={(event) => column?.setFilterValue(event.target.value)}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
};
