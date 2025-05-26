"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createSucursal, updateSucursal } from "../actions/actionsSucursales";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sucursalFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
});

export default function FormSucursal(props) {
  const { setOpenModalMenu, setOpenModalForm, sucursal } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(sucursalFormSchema),
    mode: "onChange",
    defaultValues: {
      name: sucursal?.name || "",
      userId: sucursal?.userId || "",
    },
  });
  const { isValid } = form.formState;
  const { reset } = form;

  async function onSubmit(values) {
    setIsSubmitting(true);
    if (sucursal) {
      await onSubmitUpdate(values);
    } else {
      const { success } = await createSucursal(values);
      if (!success) {
        toast.error("Algo salió mal", {
          description: "Intenta nuevamente más tarde.",
        });
        setIsSubmitting(false);
        return;
      }
      toast.success("Sucursal creada", {
        description: "Ya está disponible en el sistema.",
      });
      if (setOpenModalForm) {
        setOpenModalForm(false);
      }
    }
    setIsSubmitting(false);
  }

  const onSubmitUpdate = async (values) => {
    if (!sucursal) {
      toast.error("Ninguna Sucursal seleccionada", {
        description: "Seleccione una sucursal para continuar.",
      });
      setIsSubmitting(false);
      return;
    }
    const sucursalId = sucursal.id;
    const { success } = await updateSucursal(values, sucursalId);
    if (!success) {
      toast.error("Algo salió mal", {
        description: "Intenta nuevamente más tarde.",
      });
      setIsSubmitting(false);
      return;
    }
    toast.success("Sucursal creada", {
      description: "Ya está disponible en el sistema.",
    });
    reset();
    if (setOpenModalForm && setOpenModalMenu) {
      setOpenModalForm(false);
      setOpenModalMenu(false);
    }
    window.location.reload();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese Nombre" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" disabled={!isValid}>
              {sucursal?.name ? "Guardar" : "Crear"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{sucursal?.name ? "Guardar" : "Crear"}</DialogTitle>
            <DialogDescription>Confirma {sucursal?.name ? "Guardar" : "Crear"} Sucursal</DialogDescription>
            <Button type="submit" disabled={!isValid || isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              {sucursal?.name ? "Guardar" : "Crear"}
            </Button>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
