import { useAuth } from "@/atoms/auth";
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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { z } from "zod";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading] = useState<boolean>(false);
  const { login } = useAuth();

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form
        formSchema={z.object({
          email: z.string().email(),
          password: z.string().min(8),
        })}
        onSubmit={login}
        defaultValues={{
          email: "",
          password: "",
        }}
        fields={(form) => (
          <div className="flex flex-col gap-5">
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
              Sign In with Email
            </Button>
          </div>
        )}
      />
    </div>
  );
}
