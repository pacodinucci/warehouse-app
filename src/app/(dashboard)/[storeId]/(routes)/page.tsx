import { db } from "@/lib/db";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return (
    <div className="h-[82vh] md:h-full border-2 border-red-500">
      Esto es un dashboard de {store?.name}
    </div>
  );
};

export default DashboardPage;
