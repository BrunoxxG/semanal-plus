import { HeaderClientes, ListClientes } from "./components";
import { auth } from "@/auth";

export default async function ClientesPage() {
  const session = await auth()

  return (
    <div className="flex flex-col gap-y-4">
      <HeaderClientes session={session} />
      <ListClientes />
    </div>
  );
}