import { HeaderSucursales, ListSucursales } from "./components";

export default async function SucursalesPage() {
  
  return (
    <div className="flex flex-col gap-y-4">
      <HeaderSucursales />
      <ListSucursales />
    </div>
  );
}