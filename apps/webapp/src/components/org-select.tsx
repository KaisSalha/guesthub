import React from "react";
import { Mode, useMode } from "@/hooks/use-mode";
import { useMe } from "@/hooks/use-me";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@guesthub/ui/select";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { cn } from "@guesthub/ui/lib";
import { useRouter } from "@tanstack/react-router";

export const OrgSelect = () => {
  const router = useRouter();
  const [isCollapsed] = useSidebarCollapsed();
  const { mode, setMode } = useMode();
  const {
    isLoading,
    memberships,
    selectedMembership,
    setSelectedMembershipId,
  } = useMe();

  const handleChange = (value: string) => {
    const parsedValue = JSON.parse(value);

    mode !== parsedValue.mode && setMode(parsedValue.mode);
    setSelectedMembershipId(parsedValue.membershipId);

    router.navigate({
      to: "/dashboard",
    });
  };

  if (isLoading || isCollapsed) return null;

  return (
    <div className={cn("flex items-center justify-center")}>
      <Select
        onValueChange={handleChange}
        value={JSON.stringify({
          membershipId: selectedMembership?.id ?? null,
          mode,
        })}
      >
        <SelectTrigger variant="noShadow">
          <SelectValue placeholder="Select attendance type" />
        </SelectTrigger>
        <SelectContent>
          {memberships?.map((membership) => (
            <SelectItem
              key={membership.id}
              value={JSON.stringify({
                membershipId: membership.id,
                mode: Mode.Org,
              })}
            >
              {membership.organization.name}
            </SelectItem>
          ))}

          <SelectItem
            value={JSON.stringify({
              membershipId: null,
              mode: Mode.Guest,
            })}
          >
            Guest
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
