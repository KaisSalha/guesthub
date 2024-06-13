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
// import { NotificationCenter } from "./notification-center";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showOnMobile?: boolean;
  showSubtitleOnMobile?: boolean;
}

const HeaderContext = atom<HeaderProps>({
  title: "",
  subtitle: "",
  showOnMobile: false,
  showSubtitleOnMobile: false,
});

export const useSetHeader = ({
  title,
  subtitle,
  showOnMobile = false,
  showSubtitleOnMobile = false,
}: HeaderProps) => {
  const [_, setHeader] = useAtom(HeaderContext);

  useEffect(() => {
    setHeader({
      title,
      subtitle,
      showOnMobile,
      showSubtitleOnMobile,
    });
  }, [setHeader, title, subtitle, showOnMobile, showSubtitleOnMobile]);
};

export const Header = () => {
  const { title, subtitle, showOnMobile, showSubtitleOnMobile } =
    useAtomValue(HeaderContext);
  const { me } = useMe();
  const router = useRouter();
  const { logout } = useAuth();

  if (!me) return null;

  return (
    <div
      className={cn(
        "w-full flex-row justify-between items-start relative",
        showOnMobile && "flex",
        !showOnMobile && "hidden md:flex"
      )}
    >
      <div className="w-fit flex flex-col items-start">
        <h1 className="text-xl font-bold">{title}</h1>
        <p
          className={cn(
            "text-sm",
            !showSubtitleOnMobile && "hidden md:inline-block"
          )}
        >
          {subtitle}
        </p>
      </div>
      <div className="flex-row gap-4 items-center hidden md:flex">
        {/* <NotificationCenter /> */}
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
