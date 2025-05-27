import { HeaderPrestamos, ListPrestamos } from "./components";

export default async function PrestamosPage() {

  return (
    <div className="flex flex-col gap-y-4">
      <HeaderPrestamos />
      <ListPrestamos />
    </div>
  );
}