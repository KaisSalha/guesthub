import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { Layout } from "./-components/layout";
import { Button } from "@guesthub/ui/button";
import { useQuery } from "@apollo/client";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { Building2 } from "lucide-react";
import { GetInviteQuery } from "@/gql/graphql";
import { Card } from "@guesthub/ui/card";
import { GetInvite } from "./-queries";

const GetStarted = () => {
  const { me, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { inviteId } = Route.useSearch();
  const { data, loading: isLoadingInvite } = useQuery<GetInviteQuery>(
    GetInvite,
    {
      variables: { id: inviteId },
      skip: !inviteId || isLoading || (!isLoading && isAuthenticated),
    }
  );

  const onGetStarted = useCallback(
    () => navigate({ to: "/team-invite/signup", search: { inviteId } }),
    [navigate, inviteId]
  );

  useEffect(() => {
    if (!isLoading && isAuthenticated && me?.first_name) {
      navigate({ to: "/team-invite/accept", search: { inviteId } });
      return;
    }
  }, [navigate, inviteId, isLoading, isAuthenticated, me?.first_name]);

  if (isLoading || isLoadingInvite) return null;

  if (!inviteId || !data?.invite) return null;

  return (
    <Layout>
      <Card className="md:w-fit md:p-20" variant="desktopOnly">
        <div className="flex flex-col items-center gap-6 md:gap-10">
          <Avatar className="cursor-pointer w-fit h-fit rounded-md">
            <AvatarImage
              src={data.invite.organization.logo_url ?? undefined}
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
            Join {data.invite.organization.name} on GuestHub
          </h1>
          <Button onClick={onGetStarted} size="lg">
            Get Started
          </Button>
          <p className="max-w-80 text-center">
            GuestHub helps your team manage their special guests more
            efficiently.
          </p>
        </div>
      </Card>
    </Layout>
  );
};

const searchSchema = z.object({
  inviteId: z.string().catch(""),
});

export const Route = createFileRoute("/team-invite/")({
  component: GetStarted,
  validateSearch: searchSchema,
});
