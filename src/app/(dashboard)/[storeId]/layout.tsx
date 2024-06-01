import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import { db } from "@/lib/db";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      // userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="md:min-h-screen h-auto flex flex-col-reverse md:flex-col justify-between md:justify-normal items-center md:gap-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200 to-green-800">
      <Navbar className="fixed bottom-0 md:static md:bottom-auto w-full" />
      <div className="flex justify-center w-full mb-[56px] md:mb-0">
        {children}
      </div>
    </div>
  );
}
