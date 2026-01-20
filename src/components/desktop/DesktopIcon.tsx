import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon?: string;
  customIcon?: React.ReactNode;
  label: string;
  onClick: () => void;
  position?: { x: number; y: number };
  onPositionChange?: (x: number, y: number) => void;
  isDraggable?: boolean;
}

export function DesktopIcon({ 
  icon, 
  customIcon, 
  label, 
  onClick, 
  position,
  onPositionChange,
  isDraggable = true
}: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempPosition, setTempPosition] = useState<{ x: number; y: number } | null>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const didDrag = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDraggable) return;
    
    e.stopPropagation();
    didDrag.current = false;
    
    const rect = iconRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    // Start drag after a small delay to distinguish from click
    clickTimer.current = setTimeout(() => {
      setIsDragging(true);
    }, 150);
  }, [isDraggable]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    didDrag.current = true;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    setTempPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }
    
    if (isDragging && tempPosition && onPositionChange) {
      onPositionChange(tempPosition.x, tempPosition.y);
    }
    
    setIsDragging(false);
    setTempPosition(null);
  }, [isDragging, tempPosition, onPositionChange]);

  // Add global listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }
    if (!didDrag.current) {
      onClick();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!didDrag.current) {
      onClick();
    }
  };

  const style = isDragging && tempPosition ? {
    position: 'fixed' as const,
    left: tempPosition.x,
    top: tempPosition.y,
    zIndex: 9999,
    cursor: 'grabbing'
  } : position ? {
    position: 'absolute' as const,
    left: position.x,
    top: position.y
  } : {};

  return (
    <button
      ref={iconRef}
      className={cn(
        "flex flex-col items-center justify-center w-20 h-20 rounded-lg",
        "hover:bg-white/10 dark:hover:bg-white/5",
        "active:bg-white/20 dark:active:bg-white/10",
        "transition-all duration-200 group",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        isDragging && "opacity-80 scale-105 shadow-xl"
      )}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      <div className={cn(
        "transition-transform duration-200",
        "group-hover:scale-110 group-active:scale-95",
        isDragging && "scale-110"
      )}>
        {customIcon || <span className="text-4xl drop-shadow-lg">{icon}</span>}
      </div>
      <span className="text-xs text-white mt-1 text-center drop-shadow-md line-clamp-2 px-1 font-medium">
        {label}
      </span>
    </button>
  );
}
