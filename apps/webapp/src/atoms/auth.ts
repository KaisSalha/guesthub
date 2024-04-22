import { QUERY_KEYS } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export const useAuth = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
  const navigate = useNavigate();
  const routerState = useRouterState();

  const isAuthenticated = !!data;

  useEffect(() => {
    if (error && routerState.location.pathname.startsWith("/dashboard")) {
      navigate({
        to: "/login",
      });
    }
  }, [error]);

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

  const logout = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      toast.error("Failed to logout");

      return;
    }

    refetch();
  };

  return {
    me: data,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
};
