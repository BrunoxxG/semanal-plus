"use client";

import { Separator } from "@/components/ui/separator";
import { Banknote, House, LayoutDashboard, ShieldUser, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const linksClient = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Prestamos", href: "/dashboard/prestamos", icon: Banknote },
];

const linksUser = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users },
  { name: "Prestamos", href: "/dashboard/prestamos", icon: Banknote },
];

const linksAdmin = [
  {
    name: "Usuarios",
    href: "/dashboard/usuarios",
    icon: ShieldUser,
  },
];

const linksSuperAdmin = [
  {
    name: "Sucursales",
    href: "/dashboard/sucursales",
    icon: House,
  },
];

export default function NavLinks(props) {
  const { user } = props;
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* <div className="text-white flex items-center justify-center">
        <img src="" alt="" className="h-24 p-2 md:h-40" />
      </div>
      <Separator /> */}

      {user?.type === "client" ? (
        <div className="p-2 md:p-6">
          <p className="text-slate-500 mb-2">GENERAL</p>
          {linksClient.map((link) => {
            const LinkIcon = link.icon;
            const isActive = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex gap-x-2 mt-2 text-sm items-center p-2 rounded-lg cursor-pointer hover:bg-primary hover:text-secondary 
              ${isActive ? "bg-primary text-secondary" : ""}
              `}
              >
                <LinkIcon className="w-5 h-5" />
                <p className="">{link.name}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="p-2 md:p-6">
          <p className="text-slate-500 mb-2">GENERAL</p>
          {linksUser.map((link) => {
            const LinkIcon = link.icon;
            const isActive = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex gap-x-2 mt-2 text-sm items-center p-2 rounded-lg cursor-pointer hover:bg-primary hover:text-secondary 
              ${isActive ? "bg-primary text-secondary" : ""}
              `}
              >
                <LinkIcon className="w-5 h-5" />
                <p className="">{link.name}</p>
              </Link>
            );
          })}
        </div>
      )}

      {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
        <>
          <Separator />
          <div className="p-2 md:p-6">
            <p className="text-slate-500 mb-2">ADMIN</p>
            {linksAdmin.map((link) => {
              const LinkIcon = link.icon;
              const isActive = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex gap-x-2 mt-2 text-sm items-center p-2 rounded-lg cursor-pointer hover:bg-primary hover:text-secondary 
                ${isActive ? "bg-primary text-secondary" : ""}
                `}
                >
                  <LinkIcon className="w-5 h-5" />
                  <p className="">{link.name}</p>
                </Link>
              );
            })}
          </div>
        </>
      )}
      {user?.role === "SUPERADMIN" && (
        <>
          <Separator />
          <div className="p-2 md:p-6">
            <p className="text-slate-500 mb-2">SUPER ADMIN</p>
            {linksSuperAdmin.map((link) => {
              const LinkIcon = link.icon;
              const isActive = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex gap-x-2 mt-2 text-sm items-center p-2 rounded-lg cursor-pointer hover:bg-primary hover:text-secondary 
                ${isActive ? "bg-primary text-secondary" : ""}
                `}
                >
                  <LinkIcon className="w-5 h-5" />
                  <p className="">{link.name}</p>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
