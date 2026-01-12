import React from 'react';
import { 
  RotateCcw, 
  SortAsc, 
  LayoutGrid, 
  Monitor, 
  Settings, 
  Paintbrush,
  FolderOpen,
  Terminal,
  FileText,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Edit3,
  Info,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  type: 'desktop' | 'file';
  onAction?: (action: string) => void;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: string;
  divider?: boolean;
}

const desktopMenuItems: MenuItem[] = [
  { label: 'View', icon: <LayoutGrid className="w-4 h-4" />, action: 'view' },
  { label: 'Sort by', icon: <SortAsc className="w-4 h-4" />, action: 'sort' },
  { label: 'Refresh', icon: <RotateCcw className="w-4 h-4" />, shortcut: 'F5', action: 'refresh', divider: true },
  { label: 'New', icon: <FileText className="w-4 h-4" />, action: 'new' },
  { label: 'Open in Terminal', icon: <Terminal className="w-4 h-4" />, action: 'terminal', divider: true },
  { label: 'Display settings', icon: <Monitor className="w-4 h-4" />, action: 'display' },
  { label: 'Personalize', icon: <Paintbrush className="w-4 h-4" />, action: 'personalize' },
];

const fileMenuItems: MenuItem[] = [
  { label: 'Open', icon: <FolderOpen className="w-4 h-4" />, action: 'open' },
  { label: 'Open with', icon: <FolderOpen className="w-4 h-4" />, action: 'open-with', divider: true },
  { label: 'Cut', icon: <Scissors className="w-4 h-4" />, shortcut: 'Ctrl+X', action: 'cut' },
  { label: 'Copy', icon: <Copy className="w-4 h-4" />, shortcut: 'Ctrl+C', action: 'copy' },
  { label: 'Paste', icon: <Clipboard className="w-4 h-4" />, shortcut: 'Ctrl+V', action: 'paste', divider: true },
  { label: 'Rename', icon: <Edit3 className="w-4 h-4" />, shortcut: 'F2', action: 'rename' },
  { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, action: 'delete', divider: true },
  { label: 'Share', icon: <Share2 className="w-4 h-4" />, action: 'share' },
  { label: 'Properties', icon: <Info className="w-4 h-4" />, shortcut: 'Alt+Enter', action: 'properties' },
];

export function ContextMenu({ x, y, isOpen, onClose, type, onAction }: ContextMenuProps) {
  if (!isOpen) return null;

  const menuItems = type === 'desktop' ? desktopMenuItems : fileMenuItems;

  // Adjust position to keep menu in viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - (menuItems.length * 36 + 20));

  const handleItemClick = (action: string) => {
    onAction?.(action);
    onClose();
  };

  return (
    <>
      {/* Invisible overlay to capture clicks */}
      <div 
        className="fixed inset-0 z-[60]" 
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      
      {/* Menu */}
      <div 
        className="fixed z-[61] min-w-[200px] animate-fade-in"
        style={{ left: adjustedX, top: adjustedY }}
      >
        <div className="glass rounded-lg shadow-xl border border-border/50 py-1.5 overflow-hidden">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.action}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-primary/10 transition-colors text-left",
                )}
                onClick={() => handleItemClick(item.action)}
              >
                <span className="text-muted-foreground">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                )}
              </button>
              {item.divider && index < menuItems.length - 1 && (
                <div className="my-1 border-t border-border/50" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
