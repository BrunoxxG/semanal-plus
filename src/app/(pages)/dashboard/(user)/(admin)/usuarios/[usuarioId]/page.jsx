import { redirect } from "next/navigation";
import { getUsuario } from "../lib/dataUsuarios";
import { DataUsuario, HeaderUsuario, FooterUsuario } from "./components";
import { auth } from "@/auth";
import { subDays } from "date-fns";

export default async function UsuarioIdPage({ params, searchParams }) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  
  
  const from = awaitedSearchParams?.from ? new Date(awaitedSearchParams.from) : subDays(new Date(), 30);
  const to = awaitedSearchParams?.to ? new Date(`${awaitedSearchParams.to}T23:59:59.000Z`) : new Date();

  const usuario = await getUsuario(awaitedParams.usuarioId, from, to);
  const session = await auth();

  if (!usuario) {
    redirect("/dashboard/usuarios");
  }

  return (
    <div>
      <HeaderUsuario user={session?.user} />
      <DataUsuario usuario={usuario} />
      {session?.user.role !== "BASIC" && <FooterUsuario usuario={usuario} />}
    </div>
  );
}
