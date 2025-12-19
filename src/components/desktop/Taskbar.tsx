import React, { useState, useEffect } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Wifi, Volume2, Battery, Search, Settings, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileExplorer } from './apps/FileExplorer';
import { ControlPanel } from './apps/ControlPanel';
import { BrowserApp } from './apps/BrowserApp';

interface TaskbarProps {
  onSearchClick: () => void;
}

export function Taskbar({ onSearchClick }: TaskbarProps) {
  const { 
    windows, 
    openWindow,
    isStartMenuOpen, 
    setIsStartMenuOpen, 
    focusWindow,
    setIsControlPanelOpen,
    isControlPanelOpen,
    activeWindowId
  } = useDesktop();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleAppClick = (appId: string) => {
    const centerX = window.innerWidth / 2 - 300;
    const centerY = window.innerHeight / 2 - 250;
    const existingWindow = windows.find(w => w.id === appId);

    if (existingWindow) {
      focusWindow(appId);
      return;
    }

    switch (appId) {
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
    }
  };

  const pinnedApps = [
    { id: 'file-explorer', icon: <Folder className="w-5 h-5" />, name: 'File Explorer' },
    { id: 'github', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ), name: 'GitHub' },
    { id: 'settings', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ), name: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 glass-strong flex items-center justify-center px-2 z-[1000]">
      {/* Center Section - Main Icons */}
      <div className="flex items-center gap-0.5">
        {/* Start Button */}
        <button
          className={cn(
            "taskbar-icon group relative",
            isStartMenuOpen && "bg-[hsl(var(--active-bg))]"
          )}
          onClick={() => {
            setIsStartMenuOpen(!isStartMenuOpen);
            setIsControlPanelOpen(false);
          }}
        >
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/90 backdrop-blur text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Start
          </div>
        </button>

        {/* Search Button */}
        <button 
          className="taskbar-icon group relative hidden sm:flex"
          onClick={() => {
            onSearchClick();
            setIsStartMenuOpen(false);
            setIsControlPanelOpen(false);
          }}
        >
          <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/90 backdrop-blur text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Search
          </div>
        </button>

        {/* Pinned Apps */}
        {pinnedApps.map(app => {
          const isOpen = windows.some(w => w.id === app.id);
          const isActive = activeWindowId === app.id;
          return (
            <button
              key={app.id}
              className={cn(
                "taskbar-icon relative group",
                isActive && "bg-[hsl(var(--active-bg))]"
              )}
              onClick={() => handleAppClick(app.id)}
            >
              <div className="transition-transform group-hover:scale-110">
                {app.icon}
              </div>
              {isOpen && (
                <div className={cn(
                  "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all",
                  isActive ? "w-4" : "w-1.5"
                )} />
              )}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/90 backdrop-blur text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {app.name}
              </div>
            </button>
          );
        })}

        {/* Open Windows (not in pinned) */}
        {windows.filter(w => !pinnedApps.some(p => p.id === w.id)).map(window => (
          <button
            key={window.id}
            className={cn(
              "taskbar-icon relative group",
              window.isFocused && "bg-[hsl(var(--active-bg))]"
            )}
            onClick={() => focusWindow(window.id)}
          >
            <span className="text-xl transition-transform group-hover:scale-110">{window.icon}</span>
            <div className={cn(
              "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all",
              window.isFocused ? "w-4" : "w-1.5"
            )} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/90 backdrop-blur text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {window.title}
            </div>
          </button>
        ))}
      </div>

      {/* Right Section - System Tray */}
      <div className="flex items-center gap-1 absolute right-2">
        <button 
          className="hidden md:flex taskbar-icon gap-1"
          onClick={() => {
            setIsControlPanelOpen(!isControlPanelOpen);
            setIsStartMenuOpen(false);
          }}
        >
          <Wifi className="w-5 h-5" />
          <Volume2 className="w-5 h-5" />
          <Battery className="w-5 h-5" />
        </button>
        
        <button 
          className={cn(
            "taskbar-icon flex-col py-1 px-2 w-auto min-w-[60px] md:min-w-[80px]",
            isControlPanelOpen && "bg-[hsl(var(--active-bg))]"
          )}
          onClick={() => {
            setIsControlPanelOpen(!isControlPanelOpen);
            setIsStartMenuOpen(false);
          }}
        >
          <span className="text-xs">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-muted-foreground">{formatDate(currentTime)}</span>
        </button>
      </div>
    </div>
  );
}