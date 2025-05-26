"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { UserIcon, PowerIcon, BookUserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function UserPanel({ user }) {
  const handleClick = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Panel de usuario</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          {user?.type === "user" ? (
            <Link href={`/dashboard/usuarios/${user?.id}`} className="flex gap-2 items-center">
              <BookUserIcon className="w-4 h-4" />
              Mi Cuenta
            </Link>
          ) : (
            <Link href={`/dashboard/clientes/${user?.id}`} className="flex gap-2 items-center">
              <BookUserIcon className="w-4 h-4" />
             Mi Cuenta
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="w-full gap-2" onClick={handleClick}>
          <PowerIcon className="w-4 h-4" />
          <p>Salir</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
