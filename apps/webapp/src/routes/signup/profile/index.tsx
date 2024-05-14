import { createFileRoute } from "@tanstack/react-router";
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
import { FileUploadModalButton } from "@/components/file-upload-modal-button";

const Profile = () => {
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
                avatar_url: z.string(),
                first_name: z.string().min(2),
                last_name: z.string().min(2),
              })}
              onSubmit={async (vals) => {
                console.log(vals);
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
                              src={field.value}
                              className="h-20 w-20"
                            />
                            <AvatarFallback className="bg-transparent border p-2 rounded-full">
                              <User strokeWidth={0.75} className="h-14 w-14" />
                            </AvatarFallback>
                          </Avatar>
                          <FormControl>
                            <FileUploadModalButton
                              onFileUploaded={(url) => {
                                form.setValue("avatar_url", url);
                              }}
                              {...field}
                              variant="outline"
                              multiple={false}
                              path="avatars"
                              circularCrop
                              aspect={1}
                            >
                              Upload a profile picture
                            </FileUploadModalButton>
                          </FormControl>
                          <FormMessage />
                        </div>
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

                  <Button type="submit" disabled={false}>
                    Continue
                  </Button>
                </div>
              )}
            />
          </div>
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

export const Route = createFileRoute("/signup/profile/")({
  component: Profile,
});
