import React from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { FileExplorer } from './apps/FileExplorer';
import { ControlPanel } from './apps/ControlPanel';
import { BrowserApp } from './apps/BrowserApp';
import { Power, User } from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  action?: () => void;
}

export function StartMenu() {
  const { isStartMenuOpen, setIsStartMenuOpen, openWindow } = useDesktop();

  const pinnedApps: AppItem[] = [
    { 
      id: 'file-explorer', 
      name: 'File Explorer', 
      icon: '📁',
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: '⚙️',
    },
    { 
      id: 'github', 
      name: 'GitHub', 
      icon: '🐙',
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '📘',
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📷',
    },
    { 
      id: 'twitter', 
      name: 'Twitter/X', 
      icon: '🐦',
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: '▶️',
    },
    { 
      id: 'spotify', 
      name: 'Spotify', 
      icon: '🎵',
    },
    { 
      id: 'calculator', 
      name: 'Calculator', 
      icon: '🔢',
    },
    { 
      id: 'notepad', 
      name: 'Notepad', 
      icon: '📝',
    },
    { 
      id: 'photos', 
      name: 'Photos', 
      icon: '🖼️',
    },
    { 
      id: 'terminal', 
      name: 'Terminal', 
      icon: '💻',
    },
  ];

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
        // Generic app window
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
    setIsStartMenuOpen(false);
  };

  if (!isStartMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[900]" 
        onClick={() => setIsStartMenuOpen(false)}
      />
      
      {/* Start Menu */}
      <div className="fixed bottom-14 left-0 right-0 mx-auto w-[95%] max-w-[600px] glass rounded-2xl overflow-hidden z-[950] animate-slide-up window-shadow">
        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-4 py-2.5">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search for apps, settings, and documents"
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Pinned Apps */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Pinned</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              All apps →
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
            {pinnedApps.map(app => (
              <button
                key={app.id}
                className="start-menu-item"
                onClick={() => handleAppClick(app)}
              >
                <span className="text-2xl mb-1">{app.icon}</span>
                <span className="text-xs truncate w-full text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
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
              <button key={i} className="flex items-center gap-3 p-2 rounded-lg hover-effect">
                <span className="text-xl">{item.icon}</span>
                <div className="text-left">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 mt-2 border-t border-border/50">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover-effect">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm">User</span>
          </button>
          <button className="p-2 rounded-lg hover-effect">
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
