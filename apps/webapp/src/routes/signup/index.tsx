import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserAuthForm } from "../login/-components/user-auth-form";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "./-components/layout";
import { useCallback, useEffect } from "react";

const Signup = () => {
  const { signup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const ok = await signup({ email, password });

      if (ok)
        navigate({
          to: "/signup/profile",
        });
    },
    [signup, navigate]
  );

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({
        to: "/signup/profile",
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Layout>
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-10 md:gap-20 w-full">
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-2xl md:text-3xl">
              Welcome to Guesthub AI
            </h1>
            <p className="font-medium text-2xl md:text-3xl text-foreground-muted">
              Guest management made easy
            </p>
          </div>
          <UserAuthForm onSubmit={onSubmit} submitLabel="Sign up" />
        </div>
        <div className="h-[45vh] w-full md:min-h-[80vh] md:w-3/6 bg-background-inverted rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
          <img
            src="/dashboard-light.png"
            alt="Signup"
            className="absolute top-1/2 -right-1/3 scale-150 md:scale-125 transform -translate-y-1/2 rounded-md"
          />
        </div>
      </div>
    </Layout>
  );
};

export const Route = createFileRoute("/signup/")({
  component: Signup,
});
