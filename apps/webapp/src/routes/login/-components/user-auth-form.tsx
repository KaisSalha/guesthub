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
import { useState } from "react";
import { z } from "zod";

interface UserAuthFormProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  onSubmit: (formData: { email: string; password: string }) => Promise<void>;
  submitLabel: string;
}

export function UserAuthForm({
  className,
  onSubmit,
  submitLabel,
  ...props
}: UserAuthFormProps) {
  const [isLoading] = useState<boolean>(false);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form
        formSchema={z.object({
          email: z.string().email(),
          password: z.string().min(8),
        })}
        onSubmit={onSubmit}
        defaultValues={{
          email: "",
          password: "",
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
                    <Input
                      {...field}
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="password"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {/* {isLoading && (
							<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
						)} */}
              {submitLabel}
            </Button>
          </div>
        )}
      />
    </div>
  );
}
