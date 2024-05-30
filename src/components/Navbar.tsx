import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
import { db } from "@/lib/db";

const Navbar = async () => {
  const stores = await db.store.findMany();
  return (
    <div className="w-full self-end md:self-center md:w-3/4 md:mx-0 md:mt-6 bg-white px-2 py-6 md:p-8 md:rounded-md shadow-md flex justify-between items-center">
      <StoreSwitcher
        items={stores}
        className="w-[50px] md:w-[200px] border-0 md:border"
      />
      <MainNav />
      <div className="p-2 pt-0 flex items-start">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
