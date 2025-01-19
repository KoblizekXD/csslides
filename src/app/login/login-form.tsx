"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/supabase/actions";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    login(values).then((error) => {
      if (error) {
        setError(error);
        setLoading(false);
      }
    });
  }

  return (
    <Form {...form}>
      <h1 className="font-bold text-xl mb-2">Sign in to CSSlides</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form
        className="flex bg-black gap-y-4 flex-col border w-1/5 h-1/2 shadow-xl rounded-xl p-4"
        onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormDescription>
                The email address you used to sign up.
              </FormDescription>
              <FormMessage className="text-red-500" />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex w-full px-2 mx-auto gap-x-2 mb-6 mt-auto">
          <Button
            type="submit"
            className="flex justify-center w-1/2"
            disabled={loading}>
            {loading && <LoaderCircle className="animate-spin" />}
            Login
          </Button>
          <Button
            variant="secondary"
            type="button"
            className="flex w-1/2 justify-center"
            disabled={loading}
            onClick={() => {
              router.push("/signup");
            }}>
            {loading && <LoaderCircle className="animate-spin" />}
            Sign-up instead
          </Button>
        </div>
      </form>
    </Form>
  );
}
