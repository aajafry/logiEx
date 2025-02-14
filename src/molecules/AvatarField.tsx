import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { Button } from "@/shadcn/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { handleAvatarChange } from "@/utilities";
import { Plus, User2 } from "lucide-react";
import { FC } from "react";

type PropsType = {
  label: string;
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AvatarField: FC<PropsType> = ({ label, avatar, setAvatar }) => (
  <FormItem>
    <FormLabel className="sr-only">{label}</FormLabel>
    <FormControl>
      <Avatar className="h-20 w-20 mx-auto relative overflow-visible">
        <Input
          className="absolute z-10 w-full h-full p-0 opacity-0 cursor-pointer"
          type="file"
          autoComplete="off"
          onChange={(e) => handleAvatarChange(e, avatar, setAvatar)}
        />
        <AvatarImage src={avatar} className="cursor-pointer rounded-full" />
        <AvatarFallback className="cursor-pointer">
          <User2 />
        </AvatarFallback>

        <Button className="absolute h-6 w-6 bottom-0 right-0 rounded-full p-1 shadow-md">
          <Plus className="w-4 h-4" />
        </Button>
      </Avatar>
    </FormControl>
    <FormMessage />
  </FormItem>
);
