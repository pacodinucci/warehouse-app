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

  return <div>Esto es un dashboard de {store?.name}</div>;
};

export default DashboardPage;
