import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMe } from "./use-me";

export const useAuth = () => {
  const { me, isLoading, error, client, refetch } = useMe();

  const navigate = useNavigate();
  const routerState = useRouterState();
  const isAuthenticated = !error && !!me;

  useEffect(() => {
    if (!!error && routerState.location.pathname.startsWith("/dashboard")) {
      navigate({
        to: "/login",
      });
    }
  }, [error, navigate, routerState.location.pathname]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      toast.error("Invalid credentials");

      return;
    }

    refetch();
  };

  const signup = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/signup`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, type: "org" }),
      }
    );

    if (!response.ok) {
      toast.error("Invalid credentials");

      return response.ok;
    }

    refetch();

    return response.ok;
  };

  const logout = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error("Failed to logout");

      toast.error("Failed to logout");

      return;
    }

    client.clearStore();

    navigate({
      to: "/login",
    });
  };

  return {
    isLoading,
    isAuthenticated,
    signup,
    login,
    logout,
  };
};
