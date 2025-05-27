"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createCliente, updateCliente } from "../actions/actionsClientes";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CircleX } from "lucide-react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";

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
    dni: z.string({ required_error: "DNI is required" }).min(1, "DNI is required"),
    phone: z.string({ required_error: "Phone is required" }).min(1, "Phone is required"),
    address: z.string({ required_error: "Address is required" }).min(1, "Address is required"),
    bankAccount: z.string({ required_error: "Bank Account is required" }).min(1, "Bank Account is required"),
    imageDniFront: z.instanceof(File).optional(),
    imageDniBack: z.instanceof(File).optional(),
  });

export default function FormCliente(props) {
  const { setOpenModalMenu, setOpenModalForm, cliente, zodPassword = false } = props;
  const [showPasswordInput, setShowPasswordInput] = useState(zodPassword);
  const [showImageDniFrontInput, setShowImageDniFrontInput] = useState(zodPassword);
  const [showImageDniBackInput, setShowImageDniBackInput] = useState(zodPassword);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  const clienteFormSchema = clientFormSchema(zodPassword === true);

  const form = useForm({
    resolver: zodResolver(clienteFormSchema),
    mode: "onChange",
    defaultValues: {
      name: cliente?.name || "",
      dni: cliente?.dni || "",
      email: cliente?.email || "",
      password: "",
      phone: cliente?.phone || "",
      address: cliente?.address || "",
      bankAccount: cliente?.bankAccount || "",
      imageDniFront: undefined,
      imageDniBack: undefined,
    },
  });
  const { isValid } = form.formState;
  const { reset } = form;

  async function onSubmit(values) {
    setIsSubmitting(true);
    if (cliente) {
      await onSubmitUpdate(values);
    } else {
      const { success } = await createCliente(values);
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
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese Nombre Completo" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese DNI" type="text" {...field} />
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
                        {pathname !== "/dashboard/clientes" && <span className="hidden md:inline">Cancelar</span>}
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
          <FormField
            control={form.control}
            name="imageDniFront"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen Frente DNI</FormLabel>
                {cliente?.imageDniFront && <img src={cliente.imageDniFront} alt="Dni Frente" />}
                {showImageDniFrontInput ? (
                  <div className="flex items-center gap-1">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        ref={field.ref}
                      />
                    </FormControl>
                    {!zodPassword && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="flex items-center gap-2"
                        onClick={() => setShowImageDniFrontInput(false)}
                      >
                        <CircleX className="w-5 h-5" />
                        {pathname !== "/dashboard/clientes" && <span className="hidden md:inline">Cancelar</span>}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Button type="button" onClick={() => setShowImageDniFrontInput(true)}>
                      Cambiar Imagen Frente
                    </Button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageDniBack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen Dorso DNI</FormLabel>
                {cliente?.imageDniBack && <img src={cliente.imageDniBack} alt="Dni Dorso" />}
                {showImageDniBackInput ? (
                  <div className="flex items-center gap-1">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        ref={field.ref}
                      />
                    </FormControl>
                    {!zodPassword && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="flex items-center gap-2"
                        onClick={() => setShowImageDniBackInput(false)}
                      >
                        <CircleX className="w-5 h-5" />
                        {pathname !== "/dashboard/clientes" && <span className="hidden md:inline">Cancelar</span>}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Button type="button" onClick={() => setShowImageDniBackInput(true)}>
                      Cambiar Imagen Dorso
                    </Button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alias / CBU</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese Alias o CBU" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!zodPassword && (
            <div className="flex flex-col gap-2 items-start">
              <Label>Sucursales asociadas</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="cursor-pointer">Ver Sucursales</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {cliente?.tenants.map((tenant, index) => (
                    <DropdownMenuItem key={index}>{tenant.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
