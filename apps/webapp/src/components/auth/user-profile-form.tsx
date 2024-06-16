import React from "react";
import { z } from "zod";
import { cn } from "@guesthub/ui/lib";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@guesthub/ui/form";
import { Input } from "@guesthub/ui/input";
import { Button } from "@guesthub/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { User } from "lucide-react";
import { useMe } from "@/hooks/use-me";
import { ImageUploadModal } from "../image-upload-modal";

interface Props {
  onSubmit: (values: {
    avatar_url: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  loading: boolean;
}

export const UserProfileForm = ({ onSubmit, loading }: Props) => {
  const { me } = useMe();

  return (
    <div className={cn("grid gap-6")}>
      <Form
        formSchema={z.object({
          avatar_url: z.string().min(1, { message: "Avatar is required" }),
          first_name: z.string().min(2, { message: "First name is required" }),
          last_name: z.string().min(2, { message: "Last name is required" }),
        })}
        onSubmit={onSubmit}
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
                        src={field.value ?? me?.avatar_url}
                        className="h-20 w-20"
                      />
                      <AvatarFallback className="bg-transparent border p-2 rounded-full">
                        <User strokeWidth={0.75} className="h-14 w-14" />
                      </AvatarFallback>
                    </Avatar>
                    <FormControl>
                      <ImageUploadModal
                        onFileUploaded={(url) => {
                          form.setValue("avatar_url", url);
                        }}
                        {...field}
                        path="avatars"
                        filename={me!.id}
                        circularCrop
                        aspect={1}
                        title="Profile picture"
                        access="public"
                      >
                        <Button type="button" variant="outline">
                          Upload a profile picture
                        </Button>
                      </ImageUploadModal>
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
  );
};
