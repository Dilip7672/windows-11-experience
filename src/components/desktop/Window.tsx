import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDesktop, WindowState } from '@/contexts/DesktopContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface WindowProps {
  window: WindowState;
}

type SnapPosition = 'none' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export function Window({ window }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } = useDesktop();
  const { accentOnTitleBars } = useSettings();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = useState(0);
  const [snapPosition, setSnapPosition] = useState<SnapPosition>('none');
  const [showSnapPreview, setShowSnapPreview] = useState<SnapPosition>('none');
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [wasMinimized, setWasMinimized] = useState(false);
  const isMobile = useIsMobile();

  // Track when window is restored from minimized state
  useEffect(() => {
    if (wasMinimized && !window.isMinimized) {
      setIsRestoring(true);
      setTimeout(() => setIsRestoring(false), 300);
    }
    setWasMinimized(window.isMinimized);
  }, [window.isMinimized, wasMinimized]);

  const handleDoubleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime < 300) {
      maximizeWindow(window.id);
    }
    setLastClickTime(now);
  }, [lastClickTime, maximizeWindow, window.id]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    focusWindow(window.id);
    handleDoubleClick();
    if (isMobile) return;
    
    setIsDragging(true);
    if (window.isMaximized) {
      const proportion = e.clientX / globalThis.innerWidth;
      setDragOffset({
        x: window.width * proportion,
        y: e.clientY,
      });
    } else {
      setDragOffset({
        x: e.clientX - window.x,
        y: e.clientY - window.y,
      });
    }
  }, [focusWindow, window.id, window.x, window.y, window.width, window.isMaximized, isMobile, handleDoubleClick]);

  const getSnapPositionFromMouse = (x: number, y: number): SnapPosition => {
    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight - 48;
    const edgeThreshold = 50;
    const cornerThreshold = 100;

    if (x < cornerThreshold && y < cornerThreshold) return 'top-left';
    if (x > screenWidth - cornerThreshold && y < cornerThreshold) return 'top-right';
    if (x < cornerThreshold && y > screenHeight - cornerThreshold) return 'bottom-left';
    if (x > screenWidth - cornerThreshold && y > screenHeight - cornerThreshold) return 'bottom-right';
    
    if (x < edgeThreshold) return 'left';
    if (x > screenWidth - edgeThreshold) return 'right';
    
    return 'none';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isMobile) return;
    
    if (window.isMaximized) {
      maximizeWindow(window.id);
    }
    
    const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.innerWidth - 100));
    const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, globalThis.innerHeight - 100));
    updateWindowPosition(window.id, newX, newY);
    
    const snapPos = getSnapPositionFromMouse(e.clientX, e.clientY);
    setShowSnapPreview(snapPos);
  }, [isDragging, window.isMaximized, window.id, dragOffset, updateWindowPosition, isMobile, maximizeWindow]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isDragging && showSnapPreview !== 'none') {
      applySnap(showSnapPreview);
    }
    setIsDragging(false);
    setShowSnapPreview('none');
  }, [isDragging, showSnapPreview]);

  const applySnap = (position: SnapPosition) => {
    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight - 48;
    
    switch (position) {
      case 'left':
        updateWindowPosition(window.id, 0, 0);
        updateWindowSize(window.id, screenWidth / 2, screenHeight);
        break;
      case 'right':
        updateWindowPosition(window.id, screenWidth / 2, 0);
        updateWindowSize(window.id, screenWidth / 2, screenHeight);
        break;
      case 'top-left':
        updateWindowPosition(window.id, 0, 0);
        updateWindowSize(window.id, screenWidth / 2, screenHeight / 2);
        break;
      case 'top-right':
        updateWindowPosition(window.id, screenWidth / 2, 0);
        updateWindowSize(window.id, screenWidth / 2, screenHeight / 2);
        break;
      case 'bottom-left':
        updateWindowPosition(window.id, 0, screenHeight / 2);
        updateWindowSize(window.id, screenWidth / 2, screenHeight / 2);
        break;
      case 'bottom-right':
        updateWindowPosition(window.id, screenWidth / 2, screenHeight / 2);
        updateWindowSize(window.id, screenWidth / 2, screenHeight / 2);
        break;
    }
    setSnapPosition(position);
  };

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

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    focusWindow(window.id);
    if (isMobile) return;
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
      document.addEventListener('touchend', () => setIsDragging(false));
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', () => setIsDragging(false));
      };
    }
  }, [isDragging, handleTouchMove]);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeWindow(window.id);
    }, 150);
  };

  // Handle minimize with animation
  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(() => {
      minimizeWindow(window.id);
      setIsMinimizing(false);
    }, 250);
  };

  if (window.isMinimized && !isMinimizing) return null;

  // On mobile, always fullscreen; on desktop, respect the window state
  const windowStyle = isMobile
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 56px)', zIndex: window.zIndex }
    : window.isMaximized
      ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: window.zIndex }
      : { top: window.y, left: window.x, width: window.width, height: window.height, zIndex: window.zIndex };

  const getSnapPreviewStyle = (): React.CSSProperties => {
    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight - 48;
    
    switch (showSnapPreview) {
      case 'left': return { left: 0, top: 0, width: screenWidth / 2, height: screenHeight };
      case 'right': return { left: screenWidth / 2, top: 0, width: screenWidth / 2, height: screenHeight };
      case 'top-left': return { left: 0, top: 0, width: screenWidth / 2, height: screenHeight / 2 };
      case 'top-right': return { left: screenWidth / 2, top: 0, width: screenWidth / 2, height: screenHeight / 2 };
      case 'bottom-left': return { left: 0, top: screenHeight / 2, width: screenWidth / 2, height: screenHeight / 2 };
      case 'bottom-right': return { left: screenWidth / 2, top: screenHeight / 2, width: screenWidth / 2, height: screenHeight / 2 };
      default: return {};
    }
  };

  // Determine animation class
  const getAnimationClass = () => {
    if (isClosing) return 'animate-window-close';
    if (isMinimizing) return 'animate-window-minimize';
    if (isRestoring) return 'animate-window-restore';
    return 'animate-window-open';
  };

  return (
    <>
      {/* Snap Preview */}
      {showSnapPreview !== 'none' && (
        <div 
          className="fixed bg-primary/20 border-2 border-primary rounded-lg pointer-events-none z-[9999] animate-scale-in"
          style={getSnapPreviewStyle()}
        />
      )}
      
      <div
        ref={windowRef}
        className={cn(
          "absolute glass window-shadow overflow-hidden flex flex-col",
          "rounded-none md:rounded-xl",
          window.isFocused ? "ring-1 ring-primary/30" : "",
          !isMobile && window.isMaximized ? "md:rounded-none" : "",
          getAnimationClass()
        )}
        style={{
          ...windowStyle,
          transition: isDragging ? 'none' : 'border-radius 0.2s ease'
        }}
        onClick={() => focusWindow(window.id)}
      >
        {/* Title Bar */}
        <div
          className={cn(
            "flex items-center justify-between px-2 md:px-2 select-none",
            "h-12 md:h-8",
            !isMobile && "cursor-move",
            accentOnTitleBars ? "bg-primary/80 text-primary-foreground" : "bg-secondary/50"
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
              className={cn(
                "w-10 h-10 md:w-11 md:h-8 flex items-center justify-center transition-all duration-150",
                accentOnTitleBars ? "hover:bg-white/20" : "hover:bg-muted",
                "active:scale-95"
              )}
              onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
            >
              <Minus className="w-5 h-5 md:w-4 md:h-4" />
            </button>
            {!isMobile && (
              <button
                className={cn(
                  "w-10 h-10 md:w-11 md:h-8 flex items-center justify-center transition-all duration-150",
                  accentOnTitleBars ? "hover:bg-white/20" : "hover:bg-muted",
                  "active:scale-95"
                )}
                onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
              >
                {window.isMaximized ? <Maximize2 className="w-4 h-4 md:w-3.5 md:h-3.5" /> : <Square className="w-4 h-4 md:w-3 md:h-3" />}
              </button>
            )}
            <button
              className={cn(
                "w-10 h-10 md:w-11 md:h-8 flex items-center justify-center transition-all duration-150",
                "hover:bg-destructive hover:text-destructive-foreground",
                "active:scale-95",
                !isMobile && "md:rounded-tr-xl"
              )}
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
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
    </>
  );
}