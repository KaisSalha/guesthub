import React, { useRef } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@guesthub/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@guesthub/ui/form";
import { z } from "zod";
import { Input } from "@guesthub/ui/input";
import { Button } from "@guesthub/ui/button";
import { toast } from "sonner";
import { useParams } from "@tanstack/react-router";
import { graphql } from "gql.tada";
import { useMutation, useQuery } from "@apollo/client";
import {
  EventUserAttendanceType,
  InviteEventAttendanceMutation,
  InviteEventAttendanceMutationVariables,
  OrgMembersSelectQueryQuery,
} from "@/gql/graphql";
import { Checkbox } from "@guesthub/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@guesthub/ui/select";
import { useMe } from "@/hooks/use-me";
import { Combobox } from "@guesthub/ui/combobox";
import { Loader } from "lucide-react";

export const InviteGuestForm = () => {
  const { selectedMembership } = useMe();
  const params = useParams({ strict: false });
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { data: orgMembersData } = useQuery<OrgMembersSelectQueryQuery>(
    InviteGuestForm.queries.OrgMembersSelect,
    {
      variables: {
        orgId: selectedMembership?.organization.id,
      },
    }
  );

  const [inviteGuest, { loading }] = useMutation<
    InviteEventAttendanceMutation,
    InviteEventAttendanceMutationVariables
  >(InviteGuestForm.mutation, {
    update(cache, { data }) {
      if (data?.inviteEventAttendance?.eventAttendance) {
        cache.evict({ fieldName: "eventAttendances" });
        cache.gc();
      }
    },
    onCompleted() {
      toast.success("Guest invited successfully");
    },
  });

  if (!params.id) {
    return null;
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Invite Guest</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <Form
          formSchema={z.object({
            email: z.string().email().min(1, { message: "Email is required" }),
            attendance_type: z.nativeEnum(EventUserAttendanceType),
            travel_required: z.boolean(),
            accommodation_required: z.boolean(),
          })}
          onSubmit={async ({
            email,
            attendance_type,
            accommodation_required,
            travel_required,
          }) => {
            if (!email) {
              return;
            }

            const { errors } = await inviteGuest({
              variables: {
                input: {
                  eventId: params.id!,
                  email,
                  attendance_type,
                  accommodation_required,
                  travel_required,
                },
              },
            });

            if (errors) {
              errors.forEach((error) => toast.error(error.message));
              return;
            }

            toast.success("User invited successfully");

            dialogCloseRef.current?.click();
          }}
          defaultValues={{
            email: "",
            accommodation_required: false,
            travel_required: false,
          }}
          fields={(form) => (
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="attendance_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attendance Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select attendance type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={EventUserAttendanceType.Team}>
                            Team
                          </SelectItem>
                          <SelectItem value={EventUserAttendanceType.OrgGuest}>
                            Organizer Guest
                          </SelectItem>
                          <SelectItem
                            value={EventUserAttendanceType.SpecialGuest}
                          >
                            Special Guest
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("attendance_type") ===
              EventUserAttendanceType.Team ? (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <>
                          {orgMembersData ? (
                            <Combobox
                              {...field}
                              options={orgMembersData.allOrgMembers.map(
                                (member) => ({
                                  value: member.user.email,
                                  label: member.user.full_name,
                                })
                              )}
                              triggerLabel={"Select member"}
                              searchLabel={"select member"}
                              emptyLabel={"Member not found"}
                            />
                          ) : (
                            <Loader className="h-4 w-4 animate-spin" />
                          )}
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <>
                          <Input {...field} autoComplete="off" />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="travel_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Travel Required</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accommodation_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Accommodation Required</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          )}
          formRef={formRef}
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
          Add
        </Button>
      </DialogFooter>
    </>
  );
};

InviteGuestForm.queries = {
  OrgMembersSelect: graphql(`
    query OrgMembersSelectQuery($orgId: ID!) {
      allOrgMembers(orgId: $orgId) {
        id
        user {
          id
          full_name
          email
        }
      }
    }
  `),
};

InviteGuestForm.mutation = graphql(`
  mutation inviteEventAttendance($input: InviteEventAttendanceInput!) {
    inviteEventAttendance(input: $input) {
      eventAttendance {
        id
      }
    }
  }
`);
