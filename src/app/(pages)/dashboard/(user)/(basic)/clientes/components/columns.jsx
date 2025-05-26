"use client";

import { BookUserIcon, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTableColumnHeader } from "@/components/ui/datatable-columnheader";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCliente } from "../actions/actionsClientes";
import Link from "next/link";
import { FormCliente } from ".";

export const columns = [
  {
    accessorKey: "name",
    headerTitle: "Nombre",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Nombre" />;
    },
  },
  {
    accessorKey: "email",
    headerTitle: "Email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const cliente = row.original;

      const [openModalUpdate, setOpenModalUpdate] = useState(false);
      const [openModalDelete, setOpenModalDelete] = useState(false);
      const [openModalMenu, setOpenModalMenu] = useState(false);

      const handleDelete = async (id) => {
        const response = await deleteCliente(id);
        if (response.success) {
          toast.success("Cliente eliminado", {
            description: "Ya no se encuentra en el sistema.",
          });
          setOpenModalDelete(false);
          setOpenModalMenu(false);
        } else {
          toast.error("Algo salió mal", {
            description: "Intenta nuevamente más tarde.",
          });
        }
      };

      return (
        <>
          <DropdownMenu open={openModalMenu} onOpenChange={setOpenModalMenu}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/dashboard/clientes/${cliente.id}`} className="flex gap-2 items-center">
                  <BookUserIcon className="w-4 h-4" />
                  Detalles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setOpenModalUpdate(true);
                  setOpenModalMenu(false);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setOpenModalDelete(true);
                  setOpenModalMenu(false);
                }}
              >
                <Trash className="w-4 h-4 mr-2" />
                Borrar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={openModalUpdate} onOpenChange={setOpenModalUpdate}>
            <DialogContent>
              <DialogTitle>Editar</DialogTitle>
              <FormCliente
                setOpenModalForm={setOpenModalUpdate}
                cliente={cliente}
                setOpenModalMenu={setOpenModalMenu}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openModalDelete} onOpenChange={setOpenModalDelete}>
            <DialogContent>
              <DialogTitle>Borrar</DialogTitle>
              <DialogDescription>Confirma borrar cliente: {cliente.name}</DialogDescription>
              <Button variant="destructive" onClick={() => handleDelete(cliente.id)}>
                Borrar
              </Button>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
