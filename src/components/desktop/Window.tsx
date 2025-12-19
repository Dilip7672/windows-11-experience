import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDesktop, WindowState } from '@/contexts/DesktopContext';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface WindowProps {
  window: WindowState;
}

export function Window({ window }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition } = useDesktop();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    focusWindow(window.id);
    if (isMobile) return; // Disable dragging on mobile
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.x,
      y: e.clientY - window.y,
    });
  }, [focusWindow, window.id, window.x, window.y, isMobile]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || window.isMaximized || isMobile) return;
    const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.innerWidth - 100));
    const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, globalThis.innerHeight - 100));
    updateWindowPosition(window.id, newX, newY);
  }, [isDragging, window.isMaximized, window.id, dragOffset, updateWindowPosition, isMobile]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch support - disabled on mobile since windows are fullscreen
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    focusWindow(window.id);
    if (isMobile) return; // Disable dragging on mobile
    const touch = e.touches[0];
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - window.x,
      y: touch.clientY - window.y,
    });
  }, [focusWindow, window.id, window.x, window.y, isMobile]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || window.isMaximized || isMobile) return;
    const touch = e.touches[0];
    const newX = Math.max(0, Math.min(touch.clientX - dragOffset.x, globalThis.innerWidth - 100));
    const newY = Math.max(0, Math.min(touch.clientY - dragOffset.y, globalThis.innerHeight - 100));
    updateWindowPosition(window.id, newX, newY);
  }, [isDragging, window.isMaximized, window.id, dragOffset, updateWindowPosition, isMobile]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleTouchMove, handleMouseUp]);

  if (window.isMinimized) return null;

  // On mobile, always fullscreen; on desktop, respect the window state
  const windowStyle = isMobile
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 56px)', zIndex: window.zIndex }
    : window.isMaximized
      ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: window.zIndex }
      : { top: window.y, left: window.x, width: window.width, height: window.height, zIndex: window.zIndex };

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute glass window-shadow overflow-hidden flex flex-col animate-scale-in",
        "rounded-none md:rounded-xl",
        window.isFocused ? "ring-1 ring-primary/30" : "",
        !isMobile && window.isMaximized ? "md:rounded-none" : ""
      )}
      style={windowStyle}
      onClick={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "bg-secondary/50 flex items-center justify-between px-2 md:px-2 select-none",
          "h-12 md:h-8",
          !isMobile && "cursor-move"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-lg md:text-lg">{window.icon}</span>
          <span className="text-sm font-medium truncate">{window.title}</span>
        </div>
        <div className="flex items-center window-controls flex-shrink-0">
          <button
            className="w-10 h-10 md:w-11 md:h-8 flex items-center justify-center hover-effect transition-colors hover:bg-muted"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
          >
            <Minus className="w-5 h-5 md:w-4 md:h-4" />
          </button>
          {!isMobile && (
            <button
              className="w-10 h-10 md:w-11 md:h-8 flex items-center justify-center hover-effect transition-colors hover:bg-muted"
              onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
            >
              {window.isMaximized ? <Maximize2 className="w-4 h-4 md:w-3.5 md:h-3.5" /> : <Square className="w-4 h-4 md:w-3 md:h-3" />}
            </button>
          )}
          <button
            className={cn(
              "w-10 h-10 md:w-11 md:h-8 flex items-center justify-center hover-effect transition-colors",
              "hover:bg-destructive hover:text-destructive-foreground",
              !isMobile && "md:rounded-tr-xl"
            )}
            onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
          >
            <X className="w-5 h-5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-background">
        {window.content}
      </div>
    </div>
  );
}
