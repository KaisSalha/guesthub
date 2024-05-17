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
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { Building2 } from "lucide-react";
import { ImageUploadModalButton } from "@/components/image-upload-modal-button";
import { useAuth } from "@/hooks/use-auth";
import locationTimezone from "node-location-timezone";
import { Combobox } from "@guesthub/ui/combobox";
import { useTheme } from "next-themes";
import { cn } from "@guesthub/ui/lib";

const Organization = () => {
  const { me } = useAuth();
  const { resolvedTheme } = useTheme();
  // const navigate = useNavigate();

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
              Setup your organization
            </p>
          </div>
          <div className={cn("grid gap-6")}>
            <Form
              formSchema={z.object({
                logo_url: z.string().min(1, { message: "Logo is required" }),
                name: z.string().min(2, { message: "Name is required" }),
                website: z.string().trim().url({ message: "Invalid URL" }),
                address: z.string().min(5, { message: "Address is required" }),
                city: z.string().min(2, { message: "City is required" }),
                country_code: z
                  .string()
                  .length(2, { message: "Invalid country" }),
              })}
              onSubmit={async ({
                logo_url,
                name,
                website,
                address,
                city,
                country_code,
              }: {
                logo_url: string;
                name: string;
                website: string;
                address: string;
                city: string;
                country_code: string;
              }) => {
                console.log({
                  logo_url,
                  name,
                  website,
                  address,
                  city,
                  country_code,
                });

                //   navigate({
                //     to: "/signup/organization",
                //   });
              }}
              defaultValues={{
                logo_url: "",
                name: "",
                website: "",
                address: "",
                city: "",
                country_code: "",
              }}
              fields={(form) => (
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row gap-5 justify-start items-center">
                          <Avatar className="cursor-pointer w-fit h-fit rounded-md">
                            <AvatarImage
                              src={field.value}
                              className="h-28 w-28"
                            />
                            <AvatarFallback className="bg-transparent border p-2 rounded-md">
                              <Building2
                                strokeWidth={0.5}
                                className="h-24 w-24"
                              />
                            </AvatarFallback>
                          </Avatar>
                          <FormControl>
                            <ImageUploadModalButton
                              onFileUploaded={(url) => {
                                form.setValue("logo_url", url);
                              }}
                              {...field}
                              variant="outline"
                              path="organizations/logos"
                              filename={me!.id}
                              aspect={1}
                            >
                              Upload a logo
                            </ImageUploadModalButton>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row w-full justify-between gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Organization name</FormLabel>
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
                        <FormItem className="flex-1">
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-row w-full justify-between gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              autoComplete="work address-level2"
                            />
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
                  <Button
                    type="submit"
                    disabled={false}
                    loading={false}
                    className="mt-2"
                  >
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

export const Route = createFileRoute("/signup/organization/")({
  component: Organization,
});
