import {
  ForgotPasswordSection,
  LoginSection,
  RegistrationSection,
} from "@/organisms";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/components/ui/tabs";
import { useState } from "react";

export const Authentication = () => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  return (
    <div className="h-dvh flex items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
        </TabsList>
        <LoginSection setOpen={setIsForgotPasswordOpen} />
        <RegistrationSection />
      </Tabs>
      <ForgotPasswordSection
        open={isForgotPasswordOpen}
        setOpen={setIsForgotPasswordOpen}
      />
    </div>
  );
};
