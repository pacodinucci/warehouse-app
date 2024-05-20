import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
import { db } from "@/lib/db";

const Navbar = async () => {
  const stores = await db.store.findMany();
  return (
    <div className="mt-6 bg-white p-8 w-3/4 rounded-md shadow-md flex justify-between">
      <StoreSwitcher items={stores} />
      <MainNav />
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Navbar;
