import { redirect } from "next/navigation";
import { getSucursal } from "../lib/dataSucursales";
import { DataSucursal, HeaderSucursal, FooterSucursal } from "./components";
import { auth } from "@/auth";
import { subDays } from "date-fns";

export default async function SucursalIdPage({ params, searchParams }) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  
  
  const from = awaitedSearchParams?.from ? new Date(awaitedSearchParams.from) : subDays(new Date(), 30);
  const to = awaitedSearchParams?.to ? new Date(`${awaitedSearchParams.to}T23:59:59.000Z`) : new Date();

  const sucursal = await getSucursal(awaitedParams.sucursalId, from, to);
  const session = await auth();

  if (!sucursal) {
    redirect("/dashboard/sucursales");
  }

  return (
    <div>
      <HeaderSucursal user={session?.user} />
      <DataSucursal sucursal={sucursal} />
      {session?.user.role === "SUPERADMIN" && <FooterSucursal sucursal={sucursal} />}
    </div>
  );
}