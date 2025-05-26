import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getClientes } from "../lib/dataClientes";

export default async function ListClientes() {
  const clientes = await getClientes();

  return (
    <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-2 h-min">
      <DataTable data={clientes} columns={columns} searchName />
    </div>
  );
}