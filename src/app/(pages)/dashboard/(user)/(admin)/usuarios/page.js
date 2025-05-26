import { HeaderUsuarios, ListUsuarios } from "./components";
import { auth } from "@/auth";

export default async function UsuariosPage() {
  const session = await auth()

  return (
    <div className="flex flex-col gap-y-4">
      <HeaderUsuarios session={session}/>
      <ListUsuarios />
    </div>
  );
}