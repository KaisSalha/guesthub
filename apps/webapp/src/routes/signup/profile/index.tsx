import { graphql } from "gql.tada";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "../-components/layout";
import { Button } from "@guesthub/ui/button";
import { Input } from "@guesthub/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@guesthub/ui/form";
import { cn } from "@guesthub/ui/lib";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { User } from "lucide-react";
import { ImageUploadModalButton } from "@/components/image-upload-modal-button";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@apollo/client";
import { useTheme } from "next-themes";

const updateUserMutation = graphql(/* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      success
    }
  }
`);

const Profile = () => {
  const { me } = useAuth();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const [updateUser, { loading }] = useMutation(updateUserMutation, {
    update(cache) {
      cache.evict({ fieldName: "me" });
      cache.gc();
    },
  });

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
          <div className={cn("grid gap-6")}>
            <Form
              formSchema={z.object({
                avatar_url: z
                  .string()
                  .min(1, { message: "Avatar is required" }),
                first_name: z
                  .string()
                  .min(2, { message: "First name is required" }),
                last_name: z
                  .string()
                  .min(2, { message: "Last name is required" }),
              })}
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
                  to: "/signup/organization",
                });
              }}
              defaultValues={{
                avatar_url: "",
                first_name: "",
                last_name: "",
              }}
              fields={(form) => (
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row gap-5 justify-start items-center">
                          <Avatar className="cursor-pointer w-fit h-fit">
                            <AvatarImage
                              src={field.value ?? me.avatar_url}
                              className="h-20 w-20"
                            />
                            <AvatarFallback className="bg-transparent border p-2 rounded-full">
                              <User strokeWidth={0.75} className="h-14 w-14" />
                            </AvatarFallback>
                          </Avatar>
                          <FormControl>
                            <ImageUploadModalButton
                              onFileUploaded={(url) => {
                                form.setValue("avatar_url", url);
                              }}
                              {...field}
                              variant="outline"
                              path="avatars"
                              filename={me!.id}
                              circularCrop
                              aspect={1}
                            >
                              Upload a profile picture
                            </ImageUploadModalButton>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="given-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="family-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={false} loading={loading}>
                    Continue
                  </Button>
                </div>
              )}
            />
          </div>
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

export const Route = createFileRoute("/signup/profile/")({
  component: Profile,
});
