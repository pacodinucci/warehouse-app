import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sing-in");
  }

  const store = await db.store.findFirst();

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
