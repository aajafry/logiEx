import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { FC } from "react";
import { Control } from "react-hook-form";

type PropsType = {
  control: Control<any>;
  name: string;
  label: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
};

export const InputField: FC<PropsType> = ({
  control,
  name,
  label,
  type = "text",
  disabled = false,
  placeholder = "",
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete="off"
              {...field}
              value={
                field.value as string | number | readonly string[] | undefined
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
