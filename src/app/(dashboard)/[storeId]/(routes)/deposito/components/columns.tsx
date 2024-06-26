"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type DepositoColumn = {
  id: string;
  sku: string;
  code: string;
  brand: string;
  section: string;
  quantity: number;
  createdAt: string;
};

export const columns: ColumnDef<DepositoColumn>[] = [
  {
    accessorKey: "description",
    header: "Producto",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
  },
  {
    accessorKey: "section",
    header: "Sección",
  },
  {
    accessorKey: "sku",
    header: "SKU",
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
