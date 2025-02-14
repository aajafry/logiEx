import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { FC } from "react";
import { Control } from "react-hook-form";

type PropsType = {
  control: Control<any>;
  name: string;
  label: string;
  disabled?: boolean;
  placeholder?: string;
};

export const TextareaField: FC<PropsType> = ({
  control,
  name,
  label,
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
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              autoComplete="off"
              {...field}
              value={field.value as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
