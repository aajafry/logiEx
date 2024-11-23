/* eslint-disable react/prop-types */
import { Button } from "@/shadcn/components/ui/button";
import { Calendar } from "@/shadcn/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import { cn } from "@/shadcn/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import moment from "moment";

export const DateRangePicker = ({ dateRange, handleDateSelect }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            "w-fit hidden md:flex h-8 ml-2 justify-start text-left font-normal",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {moment(dateRange.from).format("MMM DD, YYYY")} -{" "}
                {moment(dateRange.to).format("MMM DD, YYYY")}
              </>
            ) : (
              moment(dateRange.from).format("MMM DD, YYYY")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          //   initialFocus
          //   defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};
