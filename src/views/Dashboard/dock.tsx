import React from 'react'
import { FloatingDock } from "@/components/ui/floating-dock";
import { links } from "@/config/static";
import { useNavigate } from "react-router-dom";

export function Dock() {
  const navigate = useNavigate();
  
  return (
    <div className='flex relative z-50 h-fit items-center justify-center gap-2'>
      <FloatingDock
        onClick={navigate}
        items={links}
      />
    </div>
  );
}
