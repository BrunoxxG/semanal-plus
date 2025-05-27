"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions/actionsLogin";
import { Switch } from "@/components/ui/switch";

export default function FormLogin() {
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      clientOrUser: false,
    },
  });

  async function onSubmit(values) {
    setError(null);
    startTransition(async () => {
      const response = await loginAction(values);
      if(response.error) {
        setError(response.error);
      } else {
        router.push('/dashboard');
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese su email" type="email" {...field} />
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
                <Input placeholder="Ingrese su password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientOrUser"
          render={({ field }) => (
            <FormItem >
              <FormControl>
                <div className="flex items-center gap-2">
                  <p>Cliente</p>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <p>Admin</p>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {
          error && <FormMessage>{error}</FormMessage>
        }
        <Button type="submit" disabled={isPending}>
          Log In
        </Button>
      </form>
    </Form>
  );
}
