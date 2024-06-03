"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, PackagePlus, SquarePlus } from "lucide-react";

interface NavigateButtonProps {
  storeId: string;
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  storeId,
  path,
  label,
  icon: Icon,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${storeId}${path}`);
  };

  return (
    <Button variant="outline" className="flex gap-4" onClick={handleClick}>
      <Icon />
      {label}
    </Button>
  );
};

export default NavigateButton;
