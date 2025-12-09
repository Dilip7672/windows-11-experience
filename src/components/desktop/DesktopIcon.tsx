import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick: () => void;
  selected?: boolean;
}

export function DesktopIcon({ icon, label, onClick, selected }: DesktopIconProps) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center w-20 h-20 p-2 rounded-lg transition-all",
        "hover:bg-[hsl(var(--hover-bg))] active:bg-[hsl(var(--active-bg))]",
        selected && "bg-primary/20"
      )}
      onDoubleClick={onClick}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-4xl mb-1 drop-shadow-lg">{icon}</span>
      <span className="text-xs text-center line-clamp-2 text-foreground drop-shadow-md">{label}</span>
    </button>
  );
}
