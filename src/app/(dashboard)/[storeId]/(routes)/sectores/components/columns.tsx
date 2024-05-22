"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { CellAction } from "./cell-action";

export type SectoresColumn = {
  id: string;
  name: string;
  qrCode: string;
  createdAt: string;
};

export const columns: ColumnDef<SectoresColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "qrCode",
    header: "Código QR",
    cell: ({ row }) => (
      <div>
        <Image
          src={row.original.qrCode}
          alt={`QR Code for ${row.original.name}`}
          width={50}
          height={50}
        />
      </div>
    ),
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
