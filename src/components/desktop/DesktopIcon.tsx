import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon?: string;
  customIcon?: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function DesktopIcon({ icon, customIcon, label, onClick }: DesktopIconProps) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center w-20 h-20 rounded-lg",
        "hover:bg-white/10 dark:hover:bg-white/5",
        "active:bg-white/20 dark:active:bg-white/10",
        "transition-all duration-200 group",
        "focus:outline-none focus:ring-2 focus:ring-white/30"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        {customIcon || <span className="text-4xl drop-shadow-lg">{icon}</span>}
      </div>
      <span className="text-xs text-white mt-1 text-center drop-shadow-md line-clamp-2 px-1 font-medium">
        {label}
      </span>
    </button>
  );
}
