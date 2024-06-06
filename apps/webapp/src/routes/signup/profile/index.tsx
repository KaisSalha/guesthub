import { graphql } from "gql.tada";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "../-components/layout";
import { useMutation } from "@apollo/client";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useMe } from "@/hooks/use-me";
import { UserProfileForm } from "@/components/auth/user-profile-form";
import { toast } from "sonner";

const Profile = () => {
  const { me, isLoading } = useMe();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const [updateUser, { loading }] = useMutation(Profile.mutations.updateUser, {
    update(cache) {
      cache.evict({ fieldName: "me" });
      cache.gc();
    },
  });

  useEffect(() => {
    if (!isLoading && (me?.first_name || me?.last_name))
      navigate({ to: "/signup/organization" });
  }, [isLoading, me, navigate]);

  if (!me) return null;

  return (
    <Layout>
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-10 md:gap-20 w-full">
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-2xl md:text-3xl">
              Let's get started
            </h1>
            <p className="font-medium text-2xl md:text-3xl text-foreground-muted">
              Setup your profile
            </p>
          </div>
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
              const { errors } = await updateUser({
                variables: {
                  input: {
                    avatar_url: avatar_url.split("?")[0],
                    first_name,
                    last_name,
                  },
                },
              });

              if (errors) {
                errors.forEach((error) => {
                  toast.error(error.message);
                });
                return;
              }

              navigate({
                to: "/signup/organization",
              });
            }}
            loading={loading}
          />
        </div>
        <div className="h-[45vh] w-full md:min-h-[80vh] md:w-3/6 bg-background-inverted rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
          <img
            src={
              resolvedTheme === "dark"
                ? "/dashboard-dark.png"
                : "/dashboard-light.png"
            }
            alt="Signup"
            className="absolute top-1/2 -right-1/3 scale-150 md:scale-125 transform -translate-y-1/2 rounded-md"
          />
        </div>
      </div>
    </Layout>
  );
};

Profile.mutations = {
  updateUser: graphql(/* GraphQL */ `
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        success
      }
    }
  `),
};

export const Route = createFileRoute("/signup/profile/")({
  component: Profile,
});
