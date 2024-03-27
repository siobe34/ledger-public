"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { ButtonHTMLAttributes, FC, createRef } from "react";

export const MobileMenuButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  const ref = createRef<HTMLButtonElement>();

  const handleClick = () => {
    const currentRef = ref.current;
    if (!currentRef) return;

    currentRef.classList.toggle("show-menu");
  };
  return (
    <Button ref={ref} {...props} onClick={handleClick}>
      <MenuIcon />
      {children}
    </Button>
  );
};
