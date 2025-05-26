import { DataTable } from "@/components/ui/data-table";
import { columns } from ".";
import { getSucursales } from "../lib/dataSucursales";

export default async function ListSucursales() {
  const sucursales = await getSucursales();

  return (
    <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-2 h-min">
      <DataTable data={sucursales} columns={columns} searchName />
    </div>
  );
}