import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@guesthub/ui/avatar";
import { Bell, User } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const router = useRouter();

  return (
    <div className="w-full hidden md:flex flex-row justify-between items-start relative">
      <div className="w-fit flex flex-col">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm">{subtitle}</p>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div className="border p-2 rounded-full cursor-pointer ">
          <Bell strokeWidth={1.25} className="h-5 w-5" />
        </div>
        <Avatar
          className="cursor-pointer w-fit h-fit"
          onClick={() =>
            router.navigate({
              to: "/dashboard/profile",
            })
          }
        >
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="h-9 w-9"
          />
          <AvatarFallback className="bg-transparent border p-2 rounded-full">
            <User strokeWidth={1.25} className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
