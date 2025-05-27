"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createPrestamo, updatePrestamo } from "../actions/actionsPrestamos";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const prestamoFormSchema = z.object({
  amount: z.coerce.number().min(1, { message: "El monto es requerido" }),
});

export default function FormPrestamo(props) {
  const { setOpenModalMenu, setOpenModalForm, prestamo } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(prestamoFormSchema),
    mode: "onChange",
    defaultValues: {
      amount: prestamo?.amount || "",
    },
  });
  const { isValid } = form.formState;
  const { reset } = form;

  async function onSubmit(values) {
    setIsSubmitting(true);
    if (prestamo) {
      await onSubmitUpdate(values);
    } else {
      const { success } = await createPrestamo(values);
      if (!success) {
        toast.error("Algo salió mal", {
          description: "Intenta nuevamente más tarde.",
        });
        setIsSubmitting(false);
        return;
      }
      toast.success("Préstamo creado", {
        description: "Ya está disponible en el sistema.",
      });
      if (setOpenModalForm) {
        setOpenModalForm(false);
      }
    }
    setIsSubmitting(false);
  }

  const onSubmitUpdate = async (values) => {
    if (!prestamo) {
      toast.error("Ninguna prestamo seleccionado", {
        description: "Seleccione un prestamo para continuar.",
      });
      setIsSubmitting(false);
      return;
    }
    const prestamoId = prestamo.id;
    const { success } = await updatePrestamo(values, prestamoId);
    if (!success) {
      toast.error("Algo salió mal", {
        description: "Intenta nuevamente más tarde.",
      });
      setIsSubmitting(false);
      return;
    }
    toast.success("Préstamo guardado", {
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
        <div className="grid md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese Monto" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" disabled={!isValid}>
              {prestamo?.id ? "Guardar" : "Crear"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{prestamo?.id ? "Guardar" : "Crear"}</DialogTitle>
            <DialogDescription>Confirma {prestamo?.id ? "Guardar" : "Crear"} Préstamo</DialogDescription>
            <Button type="submit" disabled={!isValid || isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              {prestamo?.id ? "Guardar" : "Crear"}
            </Button>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
