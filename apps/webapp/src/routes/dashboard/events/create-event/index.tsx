import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";
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
import { ImageUploadModal } from "@/components/image-upload-modal";
import { AspectRatio } from "@guesthub/ui/aspect-ratio";
import { ArrowRight, Clock, Image, Map, Ticket } from "lucide-react";
import { Combobox } from "@guesthub/ui/combobox";
import locationTimezone from "node-location-timezone";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { DatePicker } from "@guesthub/ui/date-picker";
import { TimePicker } from "@guesthub/ui/time-picker";
import { fromDate } from "@internationalized/date";
import { setTime } from "@/utils/datetime";
import { graphql } from "gql.tada";
import { useMutation } from "@apollo/client";
import {
  CreateEventMutation,
  CreateEventMutationVariables,
} from "@/gql/graphql";
import { useMe } from "@/hooks/use-me";
import { toast } from "sonner";

const CreateEvent = () => {
  const { selectedMembership, me } = useMe();
  const router = useRouter();

  useSetHeader({
    title: "Create Event",
    subtitle: "Create a new upcoming event",
    showOnMobile: true,
    showSubtitleOnMobile: true,
  });

  const [createEvent, { loading }] = useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CreateEvent.mutations.createEvent, {
    update(cache) {
      cache.evict({ fieldName: "orgEvents" });
      cache.gc();
    },
  });

  if (!me) return;

  return (
    <div className="flex flex-col gap-10 mb-28">
      <Form
        formSchema={z.object({
          banner_url: z.string().min(1, { message: "Banner is required" }),
          logo_url: z.string().min(1, { message: "Logo is required" }),
          name: z.string().min(2, { message: "Name is required" }),
          tagline: z.optional(z.string()),
          website: z.optional(
            z.string().trim().url({ message: "Invalid URL" })
          ),
          address: z.string().min(5, { message: "Address is required" }),
          city: z.string().min(2, { message: "City is required" }),
          state: z.optional(z.string().min(2, { message: "Invalid state" })),
          postal_code: z.optional(
            z.string().min(2, { message: "Invalid postal code" })
          ),
          country_code: z
            .string()
            .length(2, { message: "Country is required" }),
          timezone: z.string().min(2, { message: "Invalid timezone" }),
          start_time: z.date({
            required_error: "Start time is required",
          }),
          end_time: z.date({
            required_error: "End time is required",
          }),
        })}
        onSubmit={async (formData) => {
          if (!selectedMembership?.organization.id) {
            return;
          }

          const { data, errors } = await createEvent({
            variables: {
              input: {
                ...formData,
                logo_url: formData.logo_url.split("?")[0],
                banner_url: formData.banner_url.split("?")[0],
                start_time: formData.start_time.getTime(),
                end_time: formData.end_time.getTime(),
                orgId: selectedMembership?.organization.id,
              },
            },
          });

          if (errors) {
            errors.forEach((error) => {
              toast.error(error.message);
            });
            return;
          }

          router.navigate({
            to: `/dashboard/events/${data?.createEvent.event?.id}`,
          });
        }}
        defaultValues={{
          banner_url: "",
          logo_url: "",
          name: "",
          website: "",
          address: "",
          city: "",
          state: undefined,
          postal_code: undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          country_code: "",
          start_time: undefined,
          end_time: undefined,
        }}
        fields={(form) => (
          <div className="flex  items-center w-full">
            <div className="flex flex-col gap-10 w-full max-w-[770px] px-0.5">
              <FormField
                control={form.control}
                name="banner_url"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row gap-5 justify-start items-center">
                      <FormControl>
                        <div className="w-full flex flex-row justify-center items-center">
                          <ImageUploadModal
                            onFileUploaded={(url) => {
                              form.setValue("banner_url", url);
                            }}
                            {...field}
                            path="events/banners"
                            filename={`${selectedMembership?.organization.id}-${me.id}-${new Date().getTime()}`}
                            aspect={1.91 / 1}
                            className="w-full"
                            title="Event Banner"
                            access="public"
                          >
                            <AspectRatio ratio={1.91 / 1}>
                              <Avatar className="cursor-pointer w-full h-full rounded-none">
                                <AvatarImage
                                  src={field.value}
                                  className="h-full w-full rounded-md"
                                />
                                <AvatarFallback className="flex items-center justify-center h-full w-full border border-dashed cursor-pointer text-foreground-subtle rounded-md bg-transparent">
                                  <div className="p-1.5 text-foreground-subtle">
                                    <Image
                                      strokeWidth={1}
                                      className="w-8 h-8 text-foreground-subtle"
                                    />
                                  </div>
                                  <span>Add an event banner</span>
                                </AvatarFallback>
                              </Avatar>
                            </AspectRatio>
                          </ImageUploadModal>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold flex flex-row gap-2 items-center">
                  <Ticket className="w-5 h-5" /> What is the event?
                </h2>
                <div className="flex flex-row gap-8 items-end w-full">
                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex md:flex-row gap-5 justify-start items-center">
                          <FormControl>
                            <ImageUploadModal
                              onFileUploaded={(url) => {
                                form.setValue("logo_url", url);
                              }}
                              {...field}
                              path="events/logos"
                              filename={`${selectedMembership?.organization.id}-${me.id}-${new Date().getTime()}`}
                              aspect={1}
                              title="Event logo"
                              access="public"
                            >
                              <Avatar className="cursor-pointer w-fit h-fit rounded-md">
                                <AvatarImage
                                  src={field.value}
                                  className="h-28 w-28"
                                />
                                <AvatarFallback className="w-28 h-28 bg-transparent border p-2 rounded-md flex items-center justify-center">
                                  <div className="p-1.5 text-foreground-subtle">
                                    <Image
                                      strokeWidth={1}
                                      className="w-8 h-8 text-foreground-subtle"
                                    />
                                  </div>
                                  <span>Logo</span>
                                </AvatarFallback>
                              </Avatar>
                            </ImageUploadModal>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel optional>Tagline</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel optional>Website</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold flex flex-row gap-2 items-center">
                  <Map className="w-5 h-5" /> Where is the event?
                </h2>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col md:flex-row w-full justify-between gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel optional>State/Province</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col md:flex-row w-full justify-between gap-6">
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel optional>Zip/Postal code</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="postal-code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country_code"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Combobox
                            {...field}
                            options={locationTimezone
                              .getCountries()
                              .map((c) => ({ value: c.iso2, label: c.name }))}
                            onChange={(value) =>
                              form.setValue("country_code", value)
                            }
                            triggerLabel={
                              locationTimezone.findCountryByIso(field.value)
                                ?.name
                            }
                            searchLabel={""}
                            emptyLabel={""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold flex flex-row gap-2 items-center">
                  <Clock className="w-5 h-5" /> When is the event?
                </h2>
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 md:gap-0">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start time</FormLabel>
                        <FormControl>
                          <div className="flex flex-row gap-2">
                            <DatePicker
                              className="flex-1"
                              date={field.value}
                              onSelect={(date: Date | undefined) => {
                                if (!date) return;

                                const updatedDate = new Date(date);
                                const currentTime = field.value;

                                if (!currentTime) {
                                  form.setValue("start_time", date);
                                  return;
                                }

                                updatedDate.setHours(currentTime.getHours());
                                updatedDate.setMinutes(
                                  currentTime.getMinutes()
                                );
                                updatedDate.setSeconds(
                                  currentTime.getSeconds()
                                );
                                updatedDate.setMilliseconds(
                                  currentTime.getMilliseconds()
                                );

                                form.setValue("start_time", updatedDate);
                              }}
                            />
                            <TimePicker
                              hideTimeZone
                              value={
                                field.value
                                  ? fromDate(
                                      field.value,
                                      form.getValues("timezone")
                                    )
                                  : undefined
                              }
                              onChange={(time) => {
                                if (!field.value) return;

                                const updatedDate = setTime({
                                  date: field.value,
                                  time,
                                });

                                form.setValue("start_time", updatedDate);
                              }}
                              isDisabled={!field.value}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ArrowRight className="w-5 h-5 mb-2 hidden md:flex" />
                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End time</FormLabel>
                        <FormControl>
                          <div className="flex flex-row gap-2">
                            <DatePicker
                              className="flex-1"
                              date={field.value}
                              onSelect={(date: Date | undefined) => {
                                if (!date) return;

                                const updatedDate = new Date(date);
                                const currentTime = field.value;

                                if (!currentTime) {
                                  form.setValue("end_time", date);
                                  return;
                                }

                                updatedDate.setHours(currentTime.getHours());
                                updatedDate.setMinutes(
                                  currentTime.getMinutes()
                                );
                                updatedDate.setSeconds(
                                  currentTime.getSeconds()
                                );
                                updatedDate.setMilliseconds(
                                  currentTime.getMilliseconds()
                                );

                                form.setValue("end_time", updatedDate);
                              }}
                            />
                            <TimePicker
                              hideTimeZone
                              value={
                                field.value
                                  ? fromDate(
                                      field.value,
                                      form.getValues("timezone")
                                    )
                                  : undefined
                              }
                              onChange={(time) => {
                                if (!field.value) return;

                                const updatedDate = setTime({
                                  date: field.value,
                                  time,
                                });

                                form.setValue("end_time", updatedDate);
                              }}
                              isDisabled={!field.value}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <Combobox
                          {...field}
                          options={locationTimezone
                            .getTimezones()
                            .map((t) => ({ value: t, label: t }))}
                          onChange={(value) => form.setValue("timezone", value)}
                          triggerLabel={
                            locationTimezone.findCountryByIso(field.value)?.name
                          }
                          searchLabel={""}
                          emptyLabel={""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading} loading={loading}>
                Create
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

CreateEvent.mutations = {
  createEvent: graphql(/* GraphQL */ `
    mutation CreateEvent($input: CreateEventInput!) {
      createEvent(input: $input) {
        success
        event {
          id
        }
      }
    }
  `),
};

export const Route = createFileRoute("/dashboard/events/create-event/")({
  component: CreateEvent,
});
