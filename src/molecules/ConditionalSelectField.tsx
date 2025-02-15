import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { Loader2 } from "lucide-react";
import { FC } from "react";
import { Control } from "react-hook-form";

type PropsType = {
  control: Control<any>;
  name: string;
  label: string;
  options: { value: string; label: string }[] | string[];
};

export const ConditionalSelectField: FC<PropsType> = ({
  control,
  name,
  label,
  options,
}: PropsType) => {
  // Normalize options to always be an array of { value, label }
  const normalizedOptions =
    typeof options[0] === "string"
      ? (options as string[]).map((opt) => ({ value: opt, label: opt }))
      : (options as { value: string; label: string }[]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (field.value) {
          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${label}.`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-44 w-auto rounded-md border">
                    {normalizedOptions.map((option) => (
                      <SelectItem
                        className="capitalize"
                        key={option?.value}
                        value={option?.label}
                      >
                        {option?.label}
                      </SelectItem>
                    ))}
                  </ScrollArea>
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
