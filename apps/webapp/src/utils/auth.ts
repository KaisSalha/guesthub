import { authAtom } from "@/atoms/auth";
import { jotaiStore } from "@/lib/jotaiStore";

export const getAuthHeader = () => {
	const token = jotaiStore.get(authAtom).token;
	return { authorization: token ? `Bearer ${token}` : "" };
};
