"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createUsuario, updateUsuario } from "../actions/actionsUsuarios";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { usePathname } from "next/navigation";
import { getSucursalesByApi } from "../../../(superAdmin)/sucursales/lib/dataSucursales";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userFormSchema = (zodIncludePassword) =>
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
    role: z.enum(["ADMIN", "BASIC", "SUPERADMIN"], { required_error: "Role is required" }),
    tenantId: z.string({ required_error: "TenantId is required" }).min(1, "TenantId is required"),
  });

export default function FormUsuario(props) {
  const { setOpenModalMenu, setOpenModalForm, usuario, zodPassword = false, userSession } = props;
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

  const usuarioFormSchema = userFormSchema(zodPassword === true);

  const form = useForm({
    resolver: zodResolver(usuarioFormSchema),
    mode: "onChange",
    defaultValues: {
      name: usuario?.name || "",
      email: usuario?.email || "",
      password: "",
      role: usuario?.role || undefined,
      tenantId: usuario?.tenantId || userSession?.tenantId,
    },
  });
  const { isValid } = form.formState;
  const { reset } = form;

  async function onSubmit(values) {
    setIsSubmitting(true);
    if (usuario) {
      await onSubmitUpdate(values);
    } else {
      const { success } = await createUsuario(values);
      if (!success) {
        toast.error("Algo salió mal", {
          description: "Intenta nuevamente más tarde.",
        });
        setIsSubmitting(false);
        return;
      }
      toast.success("Usuario creado", {
        description: "Ya está disponible en el sistema.",
      });
      if (setOpenModalForm) {
        setOpenModalForm(false);
      }
    }
    setIsSubmitting(false);
  }

  const onSubmitUpdate = async (values) => {
    if (!usuario) {
      toast.error("Ninguna usuario seleccionado", {
        description: "Seleccione un usuario para continuar.",
      });
      setIsSubmitting(false);
      return;
    }
    const usuarioId = usuario.id;
    const { success } = await updateUsuario(values, usuarioId);
    if (!success) {
      toast.error("Algo salió mal", {
        description: "Intenta nuevamente más tarde.",
      });
      setIsSubmitting(false);
      return;
    }
    toast.success("Usuario guardado", {
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
                        {pathname !== "/dashboard/users" && <span className="hidden md:inline">Cancelar</span>}
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={userSession?.role === "BASIC"}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BASIC">BASIC</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    {userSession?.role === "SUPERADMIN" && <SelectItem value="SUPERADMIN">SUPER ADMIN</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {userSession?.role === "SUPERADMIN" && (
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal</FormLabel>
                  {isLoading ? (
                    <div className="text-muted-foreground text-sm">Cargando sucursales...</div>
                  ) : (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Sucursal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sucursales?.map((sucursal) => (
                          <SelectItem key={sucursal.id} value={sucursal.id}>
                            {sucursal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" disabled={!isValid}>
              {usuario?.name ? "Guardar" : "Crear"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{usuario?.name ? "Guardar" : "Crear"}</DialogTitle>
            <DialogDescription>Confirma {usuario?.name ? "Guardar" : "Crear"} Usuario</DialogDescription>
            <Button type="submit" disabled={!isValid || isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              {usuario?.name ? "Guardar" : "Crear"}
            </Button>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
