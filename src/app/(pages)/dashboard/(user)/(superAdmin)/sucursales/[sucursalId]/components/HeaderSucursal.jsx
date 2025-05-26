"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderSucursal(usuario) {
  const router = useRouter();

  return (
    <div className="flex items-center text-xl mb-2">
      {(usuario.user?.role === "SUPERADMIN") && (
        <ArrowLeft className="mr-2 w-5 h-5 cursor-pointer" onClick={() => router.push("/dashboard/sucursales")} />
      )}
      Detalle de la Sucursal
    </div>
  )
}