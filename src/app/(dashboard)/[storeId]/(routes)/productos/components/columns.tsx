"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProductosColumn = {
  id: string;
  sku: string;
  brand: string;
  description: string;
  code: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductosColumn>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "code",
    header: "Código de barras",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
