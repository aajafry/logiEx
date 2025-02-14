import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { FC } from "react";
import { Control } from "react-hook-form";

type PropsType = {
  control: Control<{ [key: string]: unknown }>;
  name: string;
  label: string;
  options:
    | {
        value: string;
        label: string;
      }[]
    | string[];
};

export const SelectField: FC<PropsType> = ({ control, name, label, options }) => {
  // Normalize options to always be an array of { value, label }
  const normalizedOptions =
    typeof options[0] === "string"
      ? (options as string[]).map((opt) => ({ value: opt, label: opt }))
      : (options as { value: string; label: string }[]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value as string}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}.`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {normalizedOptions.map((option) => (
                <SelectItem
                  className="capitalize"
                  key={option?.value}
                  value={option?.label}
                >
                  {option?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
