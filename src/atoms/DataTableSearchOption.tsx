import { Input } from "@/shadcn/components/ui/input";
import { Column } from "@tanstack/react-table";
import { useEffect, useState } from "react";

type PropsType<TData> = {
  label: string;
  column: Column<TData, unknown>;
};

export const DataTableSearchOption = <TData,>({
  label,
  column,
}: PropsType<TData>) => {
  const [value, setValue] = useState<string>(
    (column.getFilterValue() as string) ?? ""
  );

  useEffect(() => {
    const timeout = setTimeout(() => column.setFilterValue(value), 300);
    return () => clearTimeout(timeout);
  }, [value, column]);

  return (
    <Input
      placeholder={`Filter ${label}s...`}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
};
