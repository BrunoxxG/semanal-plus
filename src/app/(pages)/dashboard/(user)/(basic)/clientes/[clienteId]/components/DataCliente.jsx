// import { DataTable } from "@/components/ui/data-table";
// import { columns } from "./columns";
import { FormCliente } from "../../components";
import { auth } from "@/auth";
// import DatePickerFilter from "@/components/DatePickerFilter";

export default async function DataCliente({ cliente }) {
  const session = await auth();

  return (
    <div className="grid grid-cols-1 gap-y-4">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <FormCliente cliente={cliente} userSession={session?.user} />
      </div>
      {/* <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-2 h-min">
        <p className="p-2">Lista de Facturas</p>
        <div className="p-2">
          <DatePickerFilter />
        </div>
        <DataTable
          data={user.invoices}
          columns={columns}
          searchClient
          filterWholeslaer
          filterTypePayment
          filterStatus
        />
      </div> */}
    </div>
  );
}
