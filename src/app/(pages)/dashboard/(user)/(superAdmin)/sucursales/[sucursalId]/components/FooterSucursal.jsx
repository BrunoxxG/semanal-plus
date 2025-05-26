"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteSucursal } from "../../actions/actionsSucursales";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function FooterSucursal({ sucursal }) {
  const onDeleteSucursal = async () => {
    const response = await deleteSucursal(sucursal.id);
    if (response.success) {
      toast.success("Sucursal eliminada", {
        description: "Ya no se encuentra en el sistema.",
      });
      window.location.reload();
    } else {
      toast.error("Algo salió mal", {
        description: "Intenta nuevamente más tarde.",
      });
    }
  };

  return (
    <div className="flex justify-end mt-5">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Trash className="w-4 h-4 mr-2" />
            Borrar Sucursal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Borrar</DialogTitle>
          <DialogDescription>Confirma Borrar sucursal: {sucursal.name}</DialogDescription>
          <Button variant="destructive" onClick={() => onDeleteSucursal()}>
            Borrar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
