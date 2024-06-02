import { db } from "@/lib/db";
import { format } from "date-fns";

import { SectoresClient } from "./components/cilent";
import { SectoresColumn } from "./components/columns";

const SectoresPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;

  const sectores = await db.section.findMany({
    where: {
      storeId,
    },
  });

  const sectoresFormat: SectoresColumn[] = sectores.map((item) => ({
    id: item.id,
    name: item.name,
    qrCode: item.qrCode,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="w-screen md:w-3/4 h-auto md:h-[75%] min-h-screen md:min-h-0 bg-white md:rounded-md md:shadow-md mb-10">
      <SectoresClient data={sectoresFormat} />
    </div>
  );
};

export default SectoresPage;
