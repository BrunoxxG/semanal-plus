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
import { FormPrestamo } from ".";

export default function HeaderPrestamos() {
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex justify-between items-center gap-x-2">
      <h2 className="text-2xl">Lista de Préstamos</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button className="gap-x-2"><CirclePlus />Crear Préstamo</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Crear Préstamo</DialogTitle>
            <DialogDescription>
              Crear y Editar Préstamo
            </DialogDescription>
          </DialogHeader>
          <FormPrestamo setOpenModalForm={setOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
