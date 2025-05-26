import { DataTable } from "@/components/ui/data-table";
import { columns } from ".";
import { getUsuarios } from "../lib/dataUsuarios";

export default async function ListUsuarios() {
  const usuarios = await getUsuarios();

  return (
    <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-2 h-min">
      <DataTable data={usuarios} columns={columns} searchName />
    </div>
  );
}