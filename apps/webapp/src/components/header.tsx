import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@guesthub/ui/avatar";
import { User } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@guesthub/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useMe } from "@/hooks/use-me";
import { NotificationCenter } from "./notification-center";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const { me } = useMe();
  const router = useRouter();
  const { logout } = useAuth();

  if (!me) return null;

  return (
    <div className="w-full hidden md:flex flex-row justify-between items-start relative">
      <div className="w-fit flex flex-col items-start">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm">{subtitle}</p>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <NotificationCenter />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer w-fit h-fit">
              <AvatarImage
                src={me?.avatar_url ?? undefined}
                className="h-10 w-10"
              />
              <AvatarFallback className="bg-transparent border p-2 rounded-full">
                <User strokeWidth={1.25} className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                router.navigate({
                  to: "/dashboard/account",
                })
              }
            >
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
