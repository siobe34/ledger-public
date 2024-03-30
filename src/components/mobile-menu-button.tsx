"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createRef,
  useEffect,
  type ButtonHTMLAttributes,
  type FC,
} from "react";

export const MobileMenuButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  const pathname = usePathname();
  const ref = createRef<HTMLButtonElement>();

  const handleClick = () => {
    const currentRef = ref.current;
    if (!currentRef) return;

    currentRef.classList.toggle("show-menu");
  };

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    currentRef.classList.remove("show-menu");
  }, [pathname, ref]);

  return (
    <Button ref={ref} {...props} onClick={handleClick}>
      <MenuIcon />
      {children}
    </Button>
  );
};
