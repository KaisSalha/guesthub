import { authAtom } from "@/atoms/auth";
import { jotaiStore } from "@/lib/jotai-store";

export const getAuthHeader = () => {
  const token = jotaiStore.get(authAtom).token;
  return { authorization: token ? `Bearer ${token}` : "" };
};
