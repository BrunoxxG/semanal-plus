"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteUsuario } from "../../actions/actionsUsuarios";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function FooterUsuario({ usuario }) {
  const onDeleteUser = async () => {
    const response = await deleteUsuario(usuario.id);
    if (response.success) {
      toast.success("Usuario eliminado", {
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
            Borrar Usuario
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Borrar</DialogTitle>
          <DialogDescription>Confirma Borrar usuario: {usuario.name}</DialogDescription>
          <Button variant="destructive" onClick={() => onDeleteUser()}>
            Borrar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
