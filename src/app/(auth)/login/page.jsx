import Image from "next/image";
import FormLogin from "./components/FormLogin";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex items-center justify-center md:h-screen bg-secondary dark:bg-background">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 bg-white dark:bg-secondary rounded-lg border">
        <FormLogin />
      </div>
    </main>
  );
}
