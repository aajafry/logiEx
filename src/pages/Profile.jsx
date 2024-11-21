import { LoadingButton } from "@/atoms";
import { useState } from "react";
import { UpdatePasswordSection, UpdateProfileForm } from "@/organisms";

export const Profile = () => {
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  return (
    <div className="p-4 mb-4 space-y-4">
      <div className="flex justify-between">
        <p className="text-lg font-medium tracking-tight">My Profile</p>
        <LoadingButton
          label="Reset Password"
          size="sm"
          onClick={() => setIsResetPasswordOpen(true)}
        />
      </div>
      <UpdateProfileForm />
      <UpdatePasswordSection
        open={isResetPasswordOpen}
        setOpen={setIsResetPasswordOpen}
      />
    </div>
  );
};
