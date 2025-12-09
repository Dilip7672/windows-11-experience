import React, { useState, useEffect } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Wifi, Volume2, Battery, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Taskbar() {
  const { 
    windows, 
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

  const pinnedApps = [
    { id: 'file-explorer', icon: '📁', name: 'File Explorer' },
    { id: 'edge', icon: '🌐', name: 'Microsoft Edge' },
    { id: 'settings', icon: '⚙️', name: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 glass-strong flex items-center justify-center px-2 z-[1000]">
      {/* Left Section - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-1 absolute left-2">
        <button 
          className="taskbar-icon"
          onClick={() => {
            setIsStartMenuOpen(false);
            setIsControlPanelOpen(false);
          }}
        >
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Center Section - Main Icons */}
      <div className="flex items-center gap-1">
        {/* Start Button */}
        <button
          className={cn(
            "taskbar-icon",
            isStartMenuOpen && "bg-[hsl(var(--active-bg))]"
          )}
          onClick={() => {
            setIsStartMenuOpen(!isStartMenuOpen);
            setIsControlPanelOpen(false);
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
        </button>

        {/* Search Button */}
        <button className="taskbar-icon hidden sm:flex">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        {/* Pinned Apps */}
        {pinnedApps.map(app => {
          const isOpen = windows.some(w => w.id === app.id);
          const isActive = activeWindowId === app.id;
          return (
            <button
              key={app.id}
              className={cn(
                "taskbar-icon relative",
                isActive && "bg-[hsl(var(--active-bg))]"
              )}
              onClick={() => {
                if (isOpen) {
                  focusWindow(app.id);
                }
              }}
            >
              <span className="text-xl">{app.icon}</span>
              {isOpen && (
                <div className={cn(
                  "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all",
                  isActive ? "w-4" : "w-1.5"
                )} />
              )}
            </button>
          );
        })}

        {/* Open Windows */}
        {windows.filter(w => !pinnedApps.some(p => p.id === w.id)).map(window => (
          <button
            key={window.id}
            className={cn(
              "taskbar-icon relative",
              window.isFocused && "bg-[hsl(var(--active-bg))]"
            )}
            onClick={() => focusWindow(window.id)}
          >
            <span className="text-xl">{window.icon}</span>
            <div className={cn(
              "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all",
              window.isFocused ? "w-4" : "w-1.5"
            )} />
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
          <Wifi className="w-4 h-4" />
          <Volume2 className="w-4 h-4" />
          <Battery className="w-4 h-4" />
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
