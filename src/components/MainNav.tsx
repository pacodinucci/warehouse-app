"use client";

import Link from "next/link";

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
      active: pathname === `${params.storeId}/deposito`,
    },
    {
      href: `/${params.storeId}/productos`,
      label: "Productos",
      active: pathname === `${params.storeId}/productos`,
    },
    {
      href: `/${params.storeId}/sectores`,
      label: "Sectores",
      active: pathname === `${params.storeId}/sectores`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
