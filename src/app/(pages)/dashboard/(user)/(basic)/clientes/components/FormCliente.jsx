"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createCliente, updateCliente } from "../actions/actionsClientes";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { usePathname } from "next/navigation";
import { getSucursalesByApi } from "../../../(superAdmin)/sucursales/lib/dataSucursales";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const clientFormSchema = (zodIncludePassword) =>
  z.object({
    name: z.string({ required_error: "Name is required" }).min(1, "Name is required"),
    email: z.string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email"),
    password: zodIncludePassword
      ? z
          .string({ required_error: "Password is required" })
          .min(1, "Password is required")
          .min(6, "Password must be more than 6 characters")
          .max(32, "Password must be less than 32 characters")
      : z.string().optional(),
    phone: z.string({ required_error: "Phone is required" }).min(1, "Phone is required"),
    address: z.string({ required_error: "Address is required" }).min(1, "Address is required"),
  });

export default function FormCliente(props) {
  const { setOpenModalMenu, setOpenModalForm, cliente, zodPassword = false, userSession } = props;
  const [showPasswordInput, setShowPasswordInput] = useState(zodPassword);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const data = await getSucursalesByApi();
        setSucursales(data);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSucursales();
  }, []);

  const clienteFormSchema = clientFormSchema(zodPassword === true);

  const form = useForm({
    resolver: zodResolver(clienteFormSchema),
    mode: "onChange",
    defaultValues: {
      name: cliente?.name || "",
      email: cliente?.email || "",
      password: "",
      phone: cliente?.phone || "",
      address: cliente?.address || "",
    },
  });
  const { isValid } = form.formState;
  const { reset } = form;

  async function onSubmit(values) {
    setIsSubmitting(true);
    if (cliente) {
      await onSubmitUpdate(values);
    } else {
      const { success } = await createCliente(values, userSession.id);
      if (!success) {
        toast.error("Algo salió mal", {
          description: "Intenta nuevamente más tarde.",
        });
        setIsSubmitting(false);
        return;
      }
      toast.success("Cliente creado", {
        description: "Ya está disponible en el sistema.",
      });
      if (setOpenModalForm) {
        setOpenModalForm(false);
      }
    }
    setIsSubmitting(false);
  }

  const onSubmitUpdate = async (values) => {
    if (!cliente) {
      toast.error("Ninguna cliente seleccionado", {
        description: "Seleccione un cliente para continuar.",
      });
      setIsSubmitting(false);
      return;
    }
    const clienteId = cliente.id;
    const { success } = await updateCliente(values, clienteId);
    if (!success) {
      toast.error("Algo salió mal", {
        description: "Intenta nuevamente más tarde.",
      });
      setIsSubmitting(false);
      return;
    }
    toast.success("Cliente guardado", {
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                {showPasswordInput ? (
                  <div className="flex items-center gap-1">
                    <FormControl>
                      <Input placeholder="Ingrese Password" type="password" {...field} />
                    </FormControl>
                    {!zodPassword && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="flex items-center gap-2"
                        onClick={() => setShowPasswordInput(false)}
                      >
                        <CircleX className="w-5 h-5" />
                        {pathname !== "/dashboard/usuarios" && <span className="hidden md:inline">Cancelar</span>}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Button type="button" onClick={() => setShowPasswordInput(true)}>
                      Cambiar Contraseña
                    </Button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese Télefono" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese Dirección" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!zodPassword && (
            <p>sucursales asociadas</p>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" disabled={!isValid}>
              {cliente?.name ? "Guardar" : "Crear"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{cliente?.name ? "Guardar" : "Crear"}</DialogTitle>
            <DialogDescription>Confirma {cliente?.name ? "Guardar" : "Crear"} Cliente</DialogDescription>
            <Button type="submit" disabled={!isValid || isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              {cliente?.name ? "Guardar" : "Crear"}
            </Button>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
