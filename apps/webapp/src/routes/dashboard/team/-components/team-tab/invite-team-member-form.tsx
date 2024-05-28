import React, { useRef } from "react";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@guesthub/ui/dialog";
import { Input } from "@guesthub/ui/input";
import { Button } from "@guesthub/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@guesthub/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { graphql } from "gql.tada";
import { Combobox } from "@guesthub/ui/combobox";
import { InviteTeamMemberForm_RolesFragment } from "@/gql/graphql";

export const InviteTeamMemberForm = ({
  roles,
}: {
  roles: InviteTeamMemberForm_RolesFragment[];
}) => {
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const inviteUser = ({ variables }: any) => {
    console.log("Inviting user", variables);
  };

  const loading = false;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Invite Team Member</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <Form
          formSchema={z.object({
            email: z.string().email().min(1, { message: "Email is required" }),
            role: z.string().min(1, { message: "Role is required" }),
          })}
          onSubmit={async ({
            email,
            role,
          }: {
            email: string;
            role: string;
          }) => {
            await inviteUser({
              variables: {
                input: {
                  email,
                  role,
                },
              },
            });

            toast.success("User invited successfully");

            dialogCloseRef.current?.click();
          }}
          defaultValues={{
            email: "",
            role: undefined,
          }}
          fields={(form) => (
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Combobox
                        {...field}
                        options={roles.map((role) => ({
                          value: role.id,
                          label: role.name,
                        }))}
                        triggerLabel={"Select role"}
                        searchLabel={"select role"}
                        emptyLabel={"Role not found"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          ref={formRef}
        />
      </div>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button ref={dialogCloseRef} variant="ghost">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="button"
          loading={loading}
          onClick={() => formRef.current?.submit()}
        >
          Invite
        </Button>
      </DialogFooter>
    </>
  );
};

InviteTeamMemberForm.fragments = {
  roles: graphql(`
    fragment InviteTeamMemberForm_roles on Role {
      id
      name
    }
  `),
};
