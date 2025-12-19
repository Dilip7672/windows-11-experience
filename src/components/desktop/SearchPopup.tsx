import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Settings, Folder, Globe, X } from 'lucide-react';
import { useDesktop } from '@/contexts/DesktopContext';
import { FileExplorer } from './apps/FileExplorer';
import { ControlPanel } from './apps/ControlPanel';
import { BrowserApp } from './apps/BrowserApp';
import { PDFViewer } from './apps/PDFViewer';
import { cn } from '@/lib/utils';

interface SearchItem {
  id: string;
  name: string;
  type: 'app' | 'file' | 'setting' | 'web';
  icon: React.ReactNode;
  description?: string;
}

const searchItems: SearchItem[] = [
  { id: 'portfolio', name: 'portfolio.pdf', type: 'file', icon: <FileText className="w-5 h-5 text-red-500" />, description: 'Documents' },
  { id: 'file-explorer', name: 'File Explorer', type: 'app', icon: <Folder className="w-5 h-5 text-yellow-500" />, description: 'System app' },
  { id: 'settings', name: 'Settings', type: 'app', icon: <Settings className="w-5 h-5" />, description: 'System settings' },
  { id: 'dark-mode', name: 'Dark Mode', type: 'setting', icon: <Settings className="w-5 h-5" />, description: 'Personalization' },
  { id: 'light-mode', name: 'Light Mode', type: 'setting', icon: <Settings className="w-5 h-5" />, description: 'Personalization' },
  { id: 'github', name: 'GitHub', type: 'web', icon: <Globe className="w-5 h-5" />, description: 'github.com' },
  { id: 'facebook', name: 'Facebook', type: 'web', icon: <Globe className="w-5 h-5 text-blue-500" />, description: 'facebook.com' },
  { id: 'instagram', name: 'Instagram', type: 'web', icon: <Globe className="w-5 h-5 text-pink-500" />, description: 'instagram.com' },
  { id: 'youtube', name: 'YouTube', type: 'web', icon: <Globe className="w-5 h-5 text-red-500" />, description: 'youtube.com' },
];

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openWindow, toggleDarkMode, isDarkMode } = useDesktop();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(searchItems.slice(0, 6));
    }
  }, [query]);

  const handleItemClick = (item: SearchItem) => {
    const centerX = window.innerWidth / 2 - 300;
    const centerY = window.innerHeight / 2 - 250;

    switch (item.id) {
      case 'portfolio':
        openWindow({
          id: 'portfolio',
          title: 'portfolio.pdf',
          icon: '📄',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 700,
          height: 550,
          content: <PDFViewer />,
        });
        break;
      case 'file-explorer':
        openWindow({
          id: 'file-explorer',
          title: 'File Explorer',
          icon: '📁',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 700,
          height: 500,
          content: <FileExplorer />,
        });
        break;
      case 'settings':
        openWindow({
          id: 'settings',
          title: 'Settings',
          icon: '⚙️',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 600,
          height: 450,
          content: <ControlPanel />,
        });
        break;
      case 'dark-mode':
        if (!isDarkMode) toggleDarkMode();
        break;
      case 'light-mode':
        if (isDarkMode) toggleDarkMode();
        break;
      case 'github':
        openWindow({
          id: 'github',
          title: 'GitHub',
          icon: '🐙',
          isMinimized: false,
          isMaximized: false,
          x: centerX - 50,
          y: centerY - 50,
          width: 800,
          height: 550,
          content: <BrowserApp url="https://github.com" title="GitHub" />,
        });
        break;
      case 'facebook':
        openWindow({
          id: 'facebook',
          title: 'Facebook',
          icon: '📘',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 800,
          height: 550,
          content: <BrowserApp url="https://facebook.com" title="Facebook" />,
        });
        break;
      case 'instagram':
        openWindow({
          id: 'instagram',
          title: 'Instagram',
          icon: '📷',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 500,
          height: 600,
          content: <BrowserApp url="https://instagram.com" title="Instagram" />,
        });
        break;
      case 'youtube':
        openWindow({
          id: 'youtube',
          title: 'YouTube',
          icon: '▶️',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 850,
          height: 550,
          content: <BrowserApp url="https://youtube.com" title="YouTube" />,
        });
        break;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[900] bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[95%] max-w-[600px] glass rounded-2xl overflow-hidden z-[950] animate-scale-in window-shadow">
        {/* Search Input */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search apps, files, settings..."
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 hover:bg-secondary rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="p-3 max-h-[400px] overflow-y-auto">
          {!query && (
            <p className="text-xs text-muted-foreground px-2 mb-2">Quick access</p>
          )}
          {query && filteredItems.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-200",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="p-2 rounded-lg bg-secondary/50">
                    {item.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground capitalize">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}