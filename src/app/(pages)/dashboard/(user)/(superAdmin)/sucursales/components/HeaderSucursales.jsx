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
import { FormSucursal } from ".";

export default function HeaderSucursales() {
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex justify-between items-center gap-x-2">
      <h2 className="text-2xl">Lista de Sucursales</h2>
      <div className="flex flex-col items-end gap-2 md:flex-row">
        <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
          <DialogTrigger asChild>
            <Button className="gap-x-2">
              <CirclePlus />
              Crear Sucursal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Crear Sucursal</DialogTitle>
              <DialogDescription>Complete con los datos para crear una nueva sucursal.</DialogDescription>
            </DialogHeader>
            <FormSucursal setOpenModalForm={setOpenModalCreate}/>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}