/* eslint-disable react/prop-types */
import { Button } from "@/shadcn/components/ui/button";
import { Loader2 } from "lucide-react";

export const LoadingButton = ({ label, disabled, ...props }) => {
  return (
    <Button disabled={disabled} {...props}>
      {disabled ? (
        <>
          <Loader2 className="animate-spin" />
          Please wait
        </>
      ) : (
        label
      )}
    </Button>
  );
};
