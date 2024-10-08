import { useCallback, useEffect } from "react";
import { z } from "zod";
import { Card } from "@guesthub/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { Building2 } from "lucide-react";
import { Layout } from "../-components/layout";
import { GetEventAttendance } from "../-queries";
import { GetEventAttendanceQuery } from "@/gql/graphql";
import { useMe } from "@/hooks/use-me";

const SignUp = () => {
  const { isAuthenticated, isLoading, signup, login } = useAuth();
  const { me } = useMe();
  const navigate = useNavigate();
  const { inviteId } = Route.useSearch();
  const {
    data,
    loading: isLoadingInvite,
    refetch,
  } = useQuery<GetEventAttendanceQuery>(GetEventAttendance, {
    variables: { id: inviteId },
    skip: !inviteId || isLoading || (!isLoading && isAuthenticated),
  });

  const onSubmit = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      data?.eventAttendance?.user
        ? await login({ email, password })
        : await signup({ email, password });

      await refetch();

      if (data?.eventAttendance?.user?.profile_completed) {
        navigate({
          to: "/team-invite/accept",
          search: { inviteId },
        });
        return;
      }

      navigate({
        to: "/team-invite/signup/profile",
        search: { inviteId },
      });
    },
    [data?.eventAttendance?.user, login, signup, refetch, navigate, inviteId]
  );

  useEffect(() => {
    if (!!isLoading && isAuthenticated && !me?.first_name) {
      navigate({ to: "/team-invite/signup/profile", search: { inviteId } });
      return;
    }

    if (!!isLoading && isAuthenticated) {
      navigate({ to: "/team-invite/accept", search: { inviteId } });
      return;
    }
  }, [isLoading, isAuthenticated, me?.first_name, navigate, inviteId]);

  if (isLoading || isLoadingInvite) return <div>Loading...</div>;

  if (!inviteId || !data?.eventAttendance) return <div>Invalid invite</div>;

  return (
    <Layout>
      <Card className="md:w-fit md:p-20" variant="desktopOnly">
        <div className="flex flex-col gap-6">
          <Avatar className="cursor-pointer w-fit h-fit rounded-md self-center">
            <AvatarImage
              src={data.eventAttendance.event.logo_url ?? undefined}
              className="h-24 w-24 md:h-28 md:w-28"
            />
            <AvatarFallback className="bg-transparent border p-2 rounded-md">
              <Building2
                strokeWidth={0.5}
                className="h-24 w-24 md:h-28 md:w-28"
              />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl md:text-3xl font-bold">
            Join {data.eventAttendance.event.name} on GuestHub
          </h1>
          <p className="max-w-80">
            {data.eventAttendance.user
              ? "Please login to join the team."
              : "Please sign up to join the team."}
          </p>
          <UserAuthForm
            onSubmit={onSubmit}
            submitLabel={data.eventAttendance.user ? "Login" : "Sign up"}
            disableUserInput={true}
            defaultValues={{
              email: data.eventAttendance.email,
              password: "",
            }}
          />
        </div>
      </Card>
    </Layout>
  );
};

const searchSchema = z.object({
  inviteId: z.string().catch(""),
});

export const Route = createFileRoute("/event-invite/signup/")({
  component: SignUp,
  validateSearch: searchSchema,
});
