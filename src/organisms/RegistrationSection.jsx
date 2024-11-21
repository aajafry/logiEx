import { RegistrationFrom } from "./index.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { TabsContent } from "@/shadcn/components/ui/tabs";

export const RegistrationSection = () => {
  return (
    <TabsContent value="registration">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Account</CardTitle>
          <CardDescription>Fill in the details to register.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationFrom />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
