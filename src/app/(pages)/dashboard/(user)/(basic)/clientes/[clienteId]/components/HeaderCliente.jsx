"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderCliente({ userSession }) {
  const router = useRouter();

  return (
    <div className="flex items-center text-xl mb-2">
      {(userSession?.type === "user") && (
        <ArrowLeft className="mr-2 w-5 h-5 cursor-pointer" onClick={() => router.push("/dashboard/clientes")} />
      )}
      Detalle del Cliente
    </div>
  )
}