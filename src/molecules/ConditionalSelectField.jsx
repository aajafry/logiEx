/* eslint-disable react/prop-types */
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
import { Loader2 } from "lucide-react";

export const ConditionalSelectField = ({ control, name, label, options }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (field.value) {
          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${label}.`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      className="capitalize"
                      key={option?.value || option}
                      value={option?.label || option}
                    >
                      {option?.label || option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        } else {
          return (
            <FormItem>
              <FormLabel>Vendor</FormLabel>
              <span className="flex gap-2">
                <Loader2 className="animate-spin" />
                Please wait
              </span>
            </FormItem>
          );
        }
      }}
    />
  );
};
