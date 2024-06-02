"use client";

import Link from "next/link";
import { Warehouse, Box, Drill } from "lucide-react";

import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";

export const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}/deposito`,
      label: "Depósito",
      icon: Warehouse,
      active: pathname === `/${params.storeId}/deposito`,
    },
    {
      href: `/${params.storeId}/productos`,
      label: "Productos",
      icon: Drill,
      active: pathname === `/${params.storeId}/productos`,
    },
    {
      href: `/${params.storeId}/sectores`,
      label: "Sectores",
      icon: Box,
      active: pathname === `/${params.storeId}/sectores`,
    },
  ];

  return (
    <nav
      className={cn(
        "flex items-center space-x-6 md:space-x-4 lg:space-x-4",
        className
      )}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary flex flex-col gap-2 items-center",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          <route.icon
            className={cn(
              "md:hidden",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          />
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
