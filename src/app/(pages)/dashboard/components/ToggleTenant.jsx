"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPinHouse } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export function ToggleTenant({ sucursales, userTenantId }) {
  const [currentTenantId, setCurrentTenantId] = React.useState(userTenantId);

  React.useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? match[2] : null;
    };

    const selectedCookieTenantId = getCookie("selectedTenantId");
    if (selectedCookieTenantId) {
      setCurrentTenantId(selectedCookieTenantId);
    }
  }, []);

  const router = useRouter();

  const handleChange = (selectedId) => {
    setCurrentTenantId(selectedId);

    if (selectedId === userTenantId) {
      document.cookie = "selectedTenantId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } else {
      document.cookie = `selectedTenantId=${selectedId}; path=/; SameSite=Lax`;
    }

    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={handleChange} value={currentTenantId}>
        <SelectTrigger className="w-[200px]">
          <MapPinHouse />
          <SelectValue placeholder="Seleccione Sucursal" />
        </SelectTrigger>
        <SelectContent>
          {sucursales.map((sucursal) => (
            <SelectItem key={sucursal.id} value={sucursal.id}>
              {sucursal.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
