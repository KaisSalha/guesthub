import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { toast } from "sonner";

export const authAtom = atomWithStorage(
  "auth",
  {
    token: null,
    user: null,
  },
  undefined,
  {
    getOnInit: true,
  }
);

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom);

  const isAuthenticated = auth.token !== null;

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      toast.error("Invalid credentials");

      return;
    }

    const data = await response.json();

    setAuth(data);
  };

  const logout = () => {
    setAuth({ token: null, user: null });
  };

  return {
    token: auth.token,
    user: auth.user,
    isAuthenticated,
    login,
    logout,
  };
};
