import { Button, buttonVariants } from "@/shadcn/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { FC } from "react";

type PropsType = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    label: string;
    disabled?: boolean;
  };

export const LoadingButton: FC<PropsType> = ({
  label,
  disabled,
  size = "default",
  variant = "default",
  ...props
}) => {
  return (
    <Button disabled={disabled} size={size} variant={variant} {...props}>
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
