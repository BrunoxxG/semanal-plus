import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NavLinks, ToggleTheme, UserPanel, ToggleTenant } from ".";
import { auth } from "@/auth";
import { getSucursales } from "../(user)/(superAdmin)/sucursales/lib/dataSucursales";

export default async function Navbar() {
  const session = await auth();
  const sucursales = await getSucursales();
  return (
    <nav className="flex items-center px-2 gap-x-4 md:p-6 justify-between w-full bg-background h-20 border-b">
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="invisible" />
            <NavLinks user={session?.user}/>
          </SheetContent>
        </Sheet>
      </div>
      <div className="relative w-[300px]">
        <Input placeholder="Buscar ..." className="rounded-lg" />
        <Search strokeWidth={1} className="absolute top-2 right-2" />
      </div>
      <div className="flex gap-x-2 items-center">
        {session?.user.role === "SUPERADMIN" && (
          <ToggleTenant sucursales={sucursales} userTenantId={session.user?.tenantId}/>
        )}
        <ToggleTheme />
        <UserPanel user={session?.user}/>
      </div>
    </nav>
  );
}
