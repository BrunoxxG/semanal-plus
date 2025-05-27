// import { DataTable } from "@/components/ui/data-table";
// import { columns } from "./columns";
import { getPrestamos } from "../lib/dataPrestamos";

export default async function ListPrestamos() {
  const prestamos = await getPrestamos();

  return (
    <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-2 h-min">
      {/* <DataTable data={prestamos} columns={columns} /> */}
    </div>
  );
}