import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
import { db } from "@/lib/db";

type NavbarProps = {
  className?: string;
};

const Navbar: React.FC<NavbarProps> = async ({ className = "" }) => {
  const stores = await db.store.findMany();
  return (
    <div
      className={`w-full self-end md:self-center md:w-3/4 md:mx-0 md:mt-6 bg-white px-2 py-6 md:p-8 md:rounded-md shadow-md flex justify-between items-center z-20 ${className}`}
    >
      <StoreSwitcher
        items={stores}
        className="w-[50px] md:w-[200px] border-0 md:border text-neutral-800"
      />
      <MainNav />
      <div className="p-2 pt-0 flex items-start">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
