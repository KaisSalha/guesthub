import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { useRouter } from "@tanstack/react-router";
import { Bell, CircleUser, Dribbble, Search } from "lucide-react";
import React from "react";

export const TopBar = () => {
  const router = useRouter();

  return (
    <div className="border-border-subtle fixed top-0 left-0 z-30 flex w-full border-b bg-background-surface md:hidden py-2 px-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Dribbble className="h-6 w-6 text-brand" />
          <p className="font-bold tracking-wider text-lg">GuestHub</p>
        </div>
        <div className="flex flex-row gap-5 items-center">
          <Search className="cursor-pointer h-5 w-5" />
          <Bell className="cursor-pointer h-5 w-5" />
          <Avatar
            className="cursor-pointer h-fit w-fit"
            onClick={() =>
              router.navigate({
                to: "/dashboard/profile",
              })
            }
          >
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="h-6 w-6"
            />
            <AvatarFallback className="bg-transparent">
              <CircleUser className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
