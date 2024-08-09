import React, { useEffect } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
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
import { cn } from "@guesthub/ui/lib";
import { useDocumentTitle } from "usehooks-ts";
import { SearchBar } from "./search-bar";
// import { NotificationCenter } from "./notification-center";

interface HeaderProps {
  title: string;
  showOnMobile?: boolean;
}

const HeaderContext = atom<HeaderProps>({
  title: "",
  showOnMobile: false,
});

export const useSetHeader = ({ title, showOnMobile = false }: HeaderProps) => {
  const [_, setHeader] = useAtom(HeaderContext);
  useDocumentTitle(`GuestHub | ${title}`, {
    preserveTitleOnUnmount: false,
  });

  useEffect(() => {
    setHeader({
      title,
      showOnMobile,
    });

    return () => {
      setHeader({
        title: "",
        showOnMobile: false,
      });
    };
  }, [setHeader, title, showOnMobile]);
};

export const Header = () => {
  const { title, showOnMobile } = useAtomValue(HeaderContext);
  const { me } = useMe();
  const router = useRouter();
  const { logout } = useAuth();

  if (!me) return null;

  return (
    <div
      className={cn(
        "w-full flex-row justify-between items-center relative",
        showOnMobile && "flex",
        !showOnMobile && "hidden md:flex"
      )}
    >
      <div className="w-fit flex flex-col items-center">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <div className="w-fit flex-row justify-between gap-4 items-center hidden md:flex">
        <SearchBar />
        {/* <NotificationCenter /> */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer h-10 w-10">
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
