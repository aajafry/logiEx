import { useTokenVerification } from "@/hooks";
import { ResetPasswordFrom } from "@/organisms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";

export const ResetPassword: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  useTokenVerification(token);

  return (
    <div className="h-dvh flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new Password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordFrom token={token} />
        </CardContent>
      </Card>
    </div>
  );
};
