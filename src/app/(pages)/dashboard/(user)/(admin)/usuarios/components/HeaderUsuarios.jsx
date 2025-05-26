"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { FormUsuario } from ".";

export default function HeaderUsuarios({ session }) {
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex justify-between items-center gap-x-2">
      <h2 className="text-2xl">Lista de Usuarios</h2>
      <div className="flex flex-col items-end gap-2 md:flex-row">
        <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
          <DialogTrigger asChild>
            <Button className="gap-x-2">
              <CirclePlus />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
              <DialogDescription>Complete con los datos para crear un nuevo usuario.</DialogDescription>
            </DialogHeader>
            <FormUsuario setOpenModalForm={setOpenModalCreate} zodPassword={true} userSession={session.user}/>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}