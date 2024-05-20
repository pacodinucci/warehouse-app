import Navbar from "@/components/Navbar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="min-h-screen h-auto flex flex-col items-center space-y-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200 to-green-800">
      <Navbar />
      {children}
    </div>
  );
}
