import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon?: string;
  customIcon?: React.ReactNode;
  label: string;
  onClick: () => void;
  gridPosition?: { col: number; row: number };
  onGridPositionChange?: (col: number, row: number) => void;
  occupiedPositions?: Set<string>;
  isDraggable?: boolean;
}

// Grid configuration
const GRID_CELL_SIZE = 90; // Size of each grid cell
const GRID_PADDING = 16; // Padding from edges
const TASKBAR_HEIGHT = 48;

export function DesktopIcon({ 
  icon, 
  customIcon, 
  label, 
  onClick, 
  gridPosition,
  onGridPositionChange,
  occupiedPositions = new Set(),
  isDraggable = true
}: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempPosition, setTempPosition] = useState<{ x: number; y: number } | null>(null);
  const [previewCell, setPreviewCell] = useState<{ col: number; row: number } | null>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const didDrag = useRef(false);

  // Convert grid position to pixel position
  const getPixelPosition = (col: number, row: number) => ({
    x: GRID_PADDING + col * GRID_CELL_SIZE,
    y: GRID_PADDING + row * GRID_CELL_SIZE
  });

  // Convert pixel position to grid position
  const getGridPosition = (x: number, y: number) => ({
    col: Math.max(0, Math.round((x - GRID_PADDING) / GRID_CELL_SIZE)),
    row: Math.max(0, Math.round((y - GRID_PADDING) / GRID_CELL_SIZE))
  });

  // Get max rows based on screen height (excluding taskbar)
  const getMaxRows = () => Math.floor((window.innerHeight - TASKBAR_HEIGHT - GRID_PADDING * 2) / GRID_CELL_SIZE);
  
  // Get max cols based on icon area width (left portion of screen)
  const getMaxCols = () => Math.floor((window.innerWidth * 0.3) / GRID_CELL_SIZE);

  // Find next available position if target is occupied
  const findNextAvailable = (targetCol: number, targetRow: number): { col: number; row: number } => {
    const maxRows = getMaxRows();
    const maxCols = getMaxCols();
    
    // Check if target is available
    const targetKey = `${targetCol}-${targetRow}`;
    if (!occupiedPositions.has(targetKey) && targetRow < maxRows && targetCol < maxCols) {
      return { col: targetCol, row: targetRow };
    }

    // Search for next available in column-first order
    for (let col = targetCol; col < maxCols; col++) {
      const startRow = col === targetCol ? targetRow : 0;
      for (let row = startRow; row < maxRows; row++) {
        const key = `${col}-${row}`;
        if (!occupiedPositions.has(key)) {
          return { col, row };
        }
      }
    }
    
    // Search before the target
    for (let col = 0; col <= targetCol; col++) {
      const endRow = col === targetCol ? targetRow : maxRows;
      for (let row = 0; row < endRow; row++) {
        const key = `${col}-${row}`;
        if (!occupiedPositions.has(key)) {
          return { col, row };
        }
      }
    }
    
    return { col: targetCol, row: targetRow }; // Fallback
  };

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
    
    // Calculate preview grid cell
    const gridPos = getGridPosition(newX, newY);
    const maxRows = getMaxRows();
    const clampedRow = Math.min(Math.max(0, gridPos.row), maxRows - 1);
    const clampedCol = Math.max(0, gridPos.col);
    setPreviewCell({ col: clampedCol, row: clampedRow });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }
    
    if (isDragging && tempPosition && onGridPositionChange) {
      const gridPos = getGridPosition(tempPosition.x, tempPosition.y);
      const maxRows = getMaxRows();
      const clampedRow = Math.min(Math.max(0, gridPos.row), maxRows - 1);
      const clampedCol = Math.max(0, gridPos.col);
      
      // Find available position (may shift if occupied)
      const finalPos = findNextAvailable(clampedCol, clampedRow);
      onGridPositionChange(finalPos.col, finalPos.row);
    }
    
    setIsDragging(false);
    setTempPosition(null);
    setPreviewCell(null);
  }, [isDragging, tempPosition, onGridPositionChange, occupiedPositions]);

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

  // Calculate actual position
  const actualPosition = gridPosition 
    ? getPixelPosition(gridPosition.col, gridPosition.row)
    : { x: 0, y: 0 };

  const style = isDragging && tempPosition ? {
    position: 'fixed' as const,
    left: tempPosition.x,
    top: tempPosition.y,
    zIndex: 9999,
    cursor: 'grabbing'
  } : {
    position: 'absolute' as const,
    left: actualPosition.x,
    top: actualPosition.y
  };

  return (
    <>
      {/* Grid preview cell when dragging */}
      {isDragging && previewCell && (
        <div 
          className="absolute rounded-lg border-2 border-primary/50 bg-primary/10 pointer-events-none transition-all duration-150"
          style={{
            left: GRID_PADDING + previewCell.col * GRID_CELL_SIZE,
            top: GRID_PADDING + previewCell.row * GRID_CELL_SIZE,
            width: GRID_CELL_SIZE - 10,
            height: GRID_CELL_SIZE - 10,
            zIndex: 9998
          }}
        />
      )}
      
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
    </>
  );
}
