import React, { useState, useEffect, useRef } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { FileExplorer } from './apps/FileExplorer';
import { ControlPanel } from './apps/ControlPanel';
import { BrowserApp } from './apps/BrowserApp';
import { Power, User, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  action?: () => void;
}

export function StartMenu() {
  const { isStartMenuOpen, setIsStartMenuOpen, openWindow } = useDesktop();
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const pinnedApps: AppItem[] = [
    { id: 'file-explorer', name: 'File Explorer', icon: '📁' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'github', name: 'GitHub', icon: '🐙' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'youtube', name: 'YouTube', icon: '▶️' },
    { id: 'spotify', name: 'Spotify', icon: '🎵' },
    { id: 'calculator', name: 'Calculator', icon: '🔢' },
    { id: 'notepad', name: 'Notepad', icon: '📝' },
    { id: 'photos', name: 'Photos', icon: '🖼️' },
    { id: 'terminal', name: 'Terminal', icon: '💻' },
  ];

  // Filter apps based on search query
  const filteredApps = pinnedApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus search input when menu opens
  useEffect(() => {
    if (isStartMenuOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    if (!isStartMenuOpen) {
      setSearchQuery('');
      setIsClosing(false);
    }
  }, [isStartMenuOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsStartMenuOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleAppClick = (app: AppItem) => {
    const centerX = window.innerWidth / 2 - 300;
    const centerY = window.innerHeight / 2 - 250;

    switch (app.id) {
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
          x: centerX + 20,
          y: centerY + 20,
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
          x: centerX + 40,
          y: centerY + 40,
          width: 500,
          height: 600,
          content: <BrowserApp url="https://instagram.com" title="Instagram" />,
        });
        break;
      case 'twitter':
        openWindow({
          id: 'twitter',
          title: 'Twitter/X',
          icon: '🐦',
          isMinimized: false,
          isMaximized: false,
          x: centerX + 60,
          y: centerY + 60,
          width: 600,
          height: 550,
          content: <BrowserApp url="https://twitter.com" title="Twitter/X" />,
        });
        break;
      case 'youtube':
        openWindow({
          id: 'youtube',
          title: 'YouTube',
          icon: '▶️',
          isMinimized: false,
          isMaximized: false,
          x: centerX - 30,
          y: centerY - 30,
          width: 850,
          height: 550,
          content: <BrowserApp url="https://youtube.com" title="YouTube" />,
        });
        break;
      case 'spotify':
        openWindow({
          id: 'spotify',
          title: 'Spotify',
          icon: '🎵',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 700,
          height: 500,
          content: <BrowserApp url="https://open.spotify.com" title="Spotify" />,
        });
        break;
      default:
        openWindow({
          id: app.id,
          title: app.name,
          icon: app.icon,
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 400,
          height: 300,
          content: (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>{app.name} - Coming Soon</p>
            </div>
          ),
        });
    }
    handleClose();
  };

  if (!isStartMenuOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[900] bg-black/10",
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        )}
        onClick={handleClose}
      />
      
      {/* Start Menu */}
      <div 
        className={cn(
          "fixed bottom-14 left-0 right-0 mx-auto w-[95%] max-w-[600px] glass rounded-2xl overflow-hidden z-[950] window-shadow",
          isClosing ? "animate-start-menu-close" : "animate-start-menu-open"
        )}
      >
        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-4 py-2.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for apps, settings, and documents"
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Pinned Apps */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">
              {searchQuery ? `Results for "${searchQuery}"` : 'Pinned'}
            </h3>
            {!searchQuery && (
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                All apps →
              </button>
            )}
          </div>
          
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
              {filteredApps.map((app, index) => (
                <button
                  key={app.id}
                  className="start-menu-item animate-list-item"
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => handleAppClick(app)}
                >
                  <span className="text-2xl mb-1 transition-transform duration-200 hover:scale-110">{app.icon}</span>
                  <span className="text-xs truncate w-full text-center">{app.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground animate-fade-in">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No apps found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Recommended Section - hide when searching */}
        {!searchQuery && (
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Recommended</h3>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                More →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { name: 'My Projects', time: 'Recently added', icon: '📂' },
                { name: 'Portfolio Site', time: '2 hours ago', icon: '🌐' },
                { name: 'Design System', time: 'Yesterday', icon: '🎨' },
                { name: 'README.md', time: '3 days ago', icon: '📄' },
              ].map((item, i) => (
                <button 
                  key={i} 
                  className="flex items-center gap-3 p-2 rounded-lg hover-effect animate-list-item"
                  style={{ animationDelay: `${(i + filteredApps.length) * 30}ms` }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="text-left">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 mt-2 border-t border-border/50">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover-effect transition-bounce">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm">User</span>
          </button>
          <button className="p-2 rounded-lg hover-effect hover:text-destructive transition-all duration-200">
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}