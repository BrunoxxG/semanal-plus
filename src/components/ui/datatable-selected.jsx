import { Table } from "@tanstack/react-table";


export function DataTableSelected({ table }) {
  return (
    <div className="flex-1 text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s)
      seleccionada.
    </div>
  );
}
