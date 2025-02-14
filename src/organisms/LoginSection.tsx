import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { TabsContent } from "@/shadcn/components/ui/tabs";
import { LoginForm } from "./index.js";

export const LoginSection = ({
  setOpen,
}: {
  setOpen: (value: boolean) => void;
}) => {
  return (
    <TabsContent value="login">
      <Card>
        <CardHeader>
          <CardTitle>Login to Your Account</CardTitle>
          <CardDescription>Enter your login credentials below.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm setOpen={setOpen} />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
