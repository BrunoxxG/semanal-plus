import { HeaderClientes, ListClientes } from "./components";

export default async function ClientesPage() {

  return (
    <div className="flex flex-col gap-y-4">
      <HeaderClientes />
      <ListClientes />
    </div>
  );
}