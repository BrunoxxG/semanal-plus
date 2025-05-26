"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/datatable-viewoptions";
import { DataTableFacetedFilter } from "@/components/ui/datatable-facetedfilter";

import { roles } from "@/app/(pages)/dashboard/(user)/(admin)/usuarios/lib/dataUsuarios";

export function DataTableToolbar({ table, filters }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      {filters.searchClient && (
        <Input
          placeholder="Filtrar por Cliente..."
          value={(table.getColumn("client")?.getFilterValue()) ?? ""}
          onChange={(event) => table.getColumn("client")?.setFilterValue(event.target.value)}
          className="h-8 md:w-[250px]"
        />
      )}
      {filters.searchName && (
        <Input
          placeholder="Filtrar por Nombre..."
          value={(table.getColumn("name")?.getFilterValue()) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 md:w-[250px]"
        />
      )}
      {filters.searchSKU && (
        <Input
          placeholder="Filtrar por SKU..."
          value={(table.getColumn("SKU")?.getFilterValue()) ?? ""}
          onChange={(event) => table.getColumn("SKU")?.setFilterValue(event.target.value)}
          className="h-8 md:w-[250px]"
        />
      )}
      {filters.searchBarcode && (
        <Input
          placeholder="Filtrar por Codigo de Barras..."
          value={(table.getColumn("barcode")?.getFilterValue()) ?? ""}
          onChange={(event) => table.getColumn("barcode")?.setFilterValue(event.target.value)}
          className="h-8 md:w-[250px]"
        />
      )}

      <div className="flex w-full flex-wrap items-center justify-between gap-y-2">
        <div className="flex flex-wrap items-center gap-1">
          {filters.filterCategories && table.getColumn("category") !== undefined && (
            <DataTableFacetedFilter
              column={table.getColumn("category")}
              title="Categoria"
              options={filters.options.map((item) => ({ label: item, value: item }))}
            />
          )}
          {filters.filterWholeslaer && table.getColumn("wholesaler") !== undefined && (
            <DataTableFacetedFilter column={table.getColumn("wholesaler")} title="Mayoristas" options={wholesaler} />
          )}
          {filters.filterTypePayment && table.getColumn("typePayment") !== undefined && (
            <DataTableFacetedFilter column={table.getColumn("typePayment")} title="Forma de Pago" options={payments} />
          )}
          {filters.filterStatus && table.getColumn("status") !== undefined && (
            <DataTableFacetedFilter column={table.getColumn("status")} title="Estado" options={statuses} />
          )}
          {filters.filterOrigin && table.getColumn("origin") !== undefined && (
            <DataTableFacetedFilter
              column={table.getColumn("origin")}
              title="Desde"
              options={filters.options.map((item) => ({ label: item, value: item }))}
            />
          )}
          {filters.filterDestination && table.getColumn("destination") !== undefined && (
            <DataTableFacetedFilter
              column={table.getColumn("destination")}
              title="Hacia"
              options={filters.options.map((item) => ({ label: item, value: item }))}
            />
          )}
          {filters.filterTypeMovement && table.getColumn("type") !== undefined && (
            <DataTableFacetedFilter column={table.getColumn("type")} title="Movimiento" options={movements} />
          )}
          {filters.filterRelatedDeposit && table.getColumn("relatedDeposit") !== undefined && (
            <DataTableFacetedFilter
              column={table.getColumn("relatedDeposit")}
              title="Depósito"
              options={filters.options.map((item) => ({ label: item, value: item }))}
            />
          )}
          {filters.filterRole && table.getColumn("role") !== undefined && (
            <DataTableFacetedFilter column={table.getColumn("role")} title="Rol" options={roles} />
          )}
          {filters.filterDeposit && table.getColumn("point") !== undefined && (
            <DataTableFacetedFilter
              column={table.getColumn("point")}
              title="Punto"
              options={filters.options.map((item) => ({ label: item, value: item }))}
            />
          )}
          {isFiltered && (
            <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
