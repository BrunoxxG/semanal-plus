"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteCliente } from "../../actions/actionsClientes";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function FooterCliente({ cliente }) {
  const onDeleteClient = async () => {
    const response = await deleteCliente(cliente.id);
    if (response.success) {
      toast.success("Cliente eliminado", {
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
            Borrar Cliente
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Borrar</DialogTitle>
          <DialogDescription>Confirma Borrar cliente: {cliente.name}</DialogDescription>
          <Button variant="destructive" onClick={() => onDeleteClient()}>
            Borrar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
