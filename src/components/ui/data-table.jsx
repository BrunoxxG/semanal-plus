"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "./datatable-pagination";
import { DataTableToolbar } from "./datatable-toolbar";
import { Button } from "./button";
import { usePathname } from "next/navigation";
import { DataTableSelected } from "./datatable-selected";


export function DataTable({
  columns,
  data,
  onProductsSelected,
  pagination = true,
  toolbar = true,
  selected = false,
  options = [],
  searchName = false,
  searchSKU = false,
  searchBarcode = false,
  searchClient = false,
  filterCategories = false,
  filterWholeslaer = false,
  filterTypePayment = false,
  filterStatus = false,
  filterOrigin = false,
  filterDestination = false,
  filterTypeMovement = false,
  filterRelatedDeposit = false,
  filterRole = false,
  filterDeposit = false,
  pageSize = 20,
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [isMounted, setIsMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  if (!isMounted) {
    return null;
  }

  const toolbarFilters = {
    options,
    searchName,
    searchSKU,
    searchBarcode,
    searchClient,
    filterCategories,
    filterWholeslaer,
    filterTypePayment,
    filterStatus,
    filterOrigin,
    filterDestination,
    filterTypeMovement,
    filterRelatedDeposit,
    filterRole,
    filterDeposit,
  };

  return (
    <div className="space-y-4 max-w-full overflow-auto p-2">
      {onProductsSelected && (
        <Button
          onClick={() => {
            const selectedProducts = table.getSelectedRowModel().rows.map((row) => row.original);
            if (onProductsSelected) {
              onProductsSelected(selectedProducts);
            }
          }}
        >
          Agregar Productos Seleccionados
        </Button>
      )}
      <div className="flex flex-col items-center justify-between space-y-2 md:flex-row-reverse md:space-y-0">
        {pagination && <DataTablePagination table={table} />}
        {selected && <DataTableSelected table={table} />}
      </div>
      {toolbar && <DataTableToolbar table={table} filters={toolbarFilters} />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
