import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const sidebarCollapsedAtom = atomWithStorage(
  "sidebar-collapsed",
  false,
  undefined,
  {
    getOnInit: true,
  }
);

export const useSidebarCollapsed = () => {
  return useAtom(sidebarCollapsedAtom);
};
