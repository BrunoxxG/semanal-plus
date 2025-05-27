"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(values) {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      type: values.clientOrUser ? "user" : "client",
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
}