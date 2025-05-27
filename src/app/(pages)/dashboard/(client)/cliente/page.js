import { auth } from "@/auth";

export default async function ClientePage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-y-4">
      page cliente
    </div>
  );
}