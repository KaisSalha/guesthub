import { z } from "zod";
import { Card } from "@guesthub/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@apollo/client";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { Building2 } from "lucide-react";
import { Layout } from "../../-components/layout";
import { GetInvite } from "../../-queries";
import { GetInviteQuery, UpdateInviteUserMutation } from "@/gql/graphql";
import { graphql } from "gql.tada";
import { UserProfileForm } from "@/components/auth/user-profile-form";
import { useEffect } from "react";

const Profile = () => {
  const { me, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { inviteId } = Route.useSearch();
  const { data, loading: isLoadingInvite } = useQuery<GetInviteQuery>(
    GetInvite,
    {
      variables: { id: inviteId },
      skip: !inviteId || isLoading,
    }
  );

  const [updateUser, { loading: isLoadingUpdateUser }] =
    useMutation<UpdateInviteUserMutation>(Profile.mutations.updateUser, {
      update(cache) {
        cache.evict({ fieldName: "me" });
        cache.gc();
      },
    });

  useEffect(() => {
    if (!!isLoading && isAuthenticated && me?.first_name) {
      navigate({ to: "/team-invite/accept", search: { inviteId } });
      return;
    }
  }, [isLoading, isAuthenticated, me?.first_name, navigate, inviteId]);

  if (isLoading || isLoadingInvite) return <div>Loading...</div>;

  if (!inviteId || !data?.invite) return <div>Not found</div>;

  console.log(data.invite.user);

  return (
    <Layout>
      <Card className="md:w-fit md:p-20" variant="desktopOnly">
        <div className="flex flex-col gap-6">
          <Avatar className="cursor-pointer w-fit h-fit rounded-md self-center">
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
          <UserProfileForm
            onSubmit={async ({
              avatar_url,
              first_name,
              last_name,
            }: {
              avatar_url: string;
              first_name: string;
              last_name: string;
            }) => {
              await updateUser({
                variables: {
                  input: {
                    avatar_url,
                    first_name,
                    last_name,
                  },
                },
              });

              navigate({
                to: "/team-invite/accept",
                search: { inviteId },
              });
            }}
            loading={isLoadingUpdateUser}
          />
        </div>
      </Card>
    </Layout>
  );
};

Profile.mutations = {
  updateUser: graphql(/* GraphQL */ `
    mutation UpdateInviteUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        success
      }
    }
  `),
};

const searchSchema = z.object({
  inviteId: z.string().catch(""),
});

export const Route = createFileRoute("/team-invite/signup/profile/")({
  component: Profile,
  validateSearch: searchSchema,
});
