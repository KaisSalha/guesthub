import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Dribbble } from "lucide-react";
import { UserAuthForm } from "../../components/auth/user-auth-form";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const Login = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({
        to: "/dashboard",
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="h-full min-h-screen items-stretch flex flex-row">
      <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-background-surface p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium gap-2">
            <Dribbble />
            GuestHub
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="p-5 lg:p-8 min-h-screen flex justify-center items-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            </div>
            <UserAuthForm onSubmit={login} submitLabel="Sign In" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/login/")({
  component: Login,
});
