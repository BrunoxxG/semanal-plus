import { redirect } from "next/navigation";
import { getCliente } from "../lib/dataClientes";
import { DataCliente, HeaderCliente, FooterCliente } from "./components";
import { auth } from "@/auth";
import { subDays } from "date-fns";

export default async function ClienteIdPage({ params, searchParams }) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
   
  const from = awaitedSearchParams?.from ? new Date(awaitedSearchParams.from) : subDays(new Date(), 30);
  const to = awaitedSearchParams?.to ? new Date(`${awaitedSearchParams.to}T23:59:59.000Z`) : new Date();

  const cliente = await getCliente(awaitedParams.clienteId, from, to);
  const session = await auth();

  if (!cliente) {
    redirect("/dashboard/clientes");
  }

  return (
    <div>
      <HeaderCliente userSession={session?.user} />
      <DataCliente cliente={cliente} />
      {session?.user.role !== "BASIC" && <FooterCliente cliente={cliente} />}
    </div>
  );
}
