import Image from "next/image";
import FormClientLogin from "./components/FormClientLogin";

export default function ClientLoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-secondary dark:bg-background">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 bg-white dark:bg-secondary rounded-lg border">
        <FormClientLogin />
      </div>
    </main>
  );
}
