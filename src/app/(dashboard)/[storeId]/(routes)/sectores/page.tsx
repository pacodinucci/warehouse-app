import { db } from "@/lib/db";
import { SectoresClient } from "./components/cilent";
import { SectoresColumn } from "./components/columns";
import { format } from "date-fns";

const SectoresPage = async () => {
  const sectores = await db.section.findMany();

  const sectoresFormat: SectoresColumn[] = sectores.map((item) => ({
    id: item.id,
    name: item.name,
    qrCode: item.qrCode,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="w-3/4 h-[75%] bg-white rounded-md shadow-md mb-6">
      <SectoresClient data={sectoresFormat} />
    </div>
  );
};

export default SectoresPage;
