"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderUsuario({ userSession }) {
  const router = useRouter();

  return (
    <div className="flex items-center text-xl mb-2">
      {(userSession?.role === "ADMIN" || userSession?.role === "SUPERADMIN") && (
        <ArrowLeft className="mr-2 w-5 h-5 cursor-pointer" onClick={() => router.push("/dashboard/usuarios")} />
      )}
      Detalle del Usuario
    </div>
  )
}