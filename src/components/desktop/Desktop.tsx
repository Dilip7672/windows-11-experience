import React from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { ControlPanelPopup } from './ControlPanelPopup';
import { Window } from './Window';
import { DesktopIcon } from './DesktopIcon';
import { FileExplorer } from './apps/FileExplorer';
import { ControlPanel } from './apps/ControlPanel';
import { BrowserApp } from './apps/BrowserApp';

const desktopIcons = [
  { id: 'file-explorer', icon: '📁', label: 'File Explorer' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
  { id: 'github', icon: '🐙', label: 'GitHub' },
  { id: 'recycle-bin', icon: '🗑️', label: 'Recycle Bin' },
];

export function Desktop() {
  const { 
    windows, 
    openWindow, 
    setIsStartMenuOpen, 
    setIsControlPanelOpen 
  } = useDesktop();

  const handleDesktopClick = () => {
    setIsStartMenuOpen(false);
    setIsControlPanelOpen(false);
  };

  const handleIconClick = (id: string) => {
    const centerX = window.innerWidth / 2 - 300;
    const centerY = window.innerHeight / 2 - 250;

    switch (id) {
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
      case 'recycle-bin':
        openWindow({
          id: 'recycle-bin',
          title: 'Recycle Bin',
          icon: '🗑️',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 400,
          height: 300,
          content: (
            <div className="flex items-center justify-center h-full text-muted-foreground p-4">
              <p>Recycle Bin is empty</p>
            </div>
          ),
        });
        break;
    }
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden select-none"
      onClick={handleDesktopClick}
    >
      {/* Wallpaper */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-700 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-400 dark:bg-pink-700 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {desktopIcons.map(icon => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            onClick={() => handleIconClick(icon.id)}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.map(window => (
        <Window key={window.id} window={window} />
      ))}

      {/* Start Menu */}
      <StartMenu />

      {/* Control Panel Popup */}
      <ControlPanelPopup />

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
