import React, { useEffect, useState, useCallback } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { ControlPanelPopup } from './ControlPanelPopup';
import { SearchPopup } from './SearchPopup';
import { Window } from './Window';
import { DesktopIcon } from './DesktopIcon';
import { WeatherWidget } from './WeatherWidget';
import { ContextMenu } from './ContextMenu';
import { WallpaperPicker } from './WallpaperPicker';
import { LockScreen } from './LockScreen';
import { NotificationCenter, Notification } from './NotificationCenter';
import { LocationPermissionDialog } from './LocationPermissionDialog';
import { FileExplorer } from './apps/FileExplorer';
import { ControlPanel } from './apps/ControlPanel';
import { BrowserApp } from './apps/BrowserApp';
import { PDFViewer } from './apps/PDFViewer';
import { cn } from '@/lib/utils';
import { Bell, MapPin, Info } from 'lucide-react';

const defaultDesktopIcons = [
  { id: 'file-explorer', icon: '📁', label: 'File Explorer' },
  { id: 'settings', label: 'Settings', customIcon: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { id: 'github', label: 'GitHub', customIcon: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )},
];

export function Desktop() {
  const { windows, openWindow, setIsStartMenuOpen, setIsControlPanelOpen } = useDesktop();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Welcome!', message: 'Welcome to Windows 11 Portfolio. Explore the desktop!', icon: <Info className="w-4 h-4 text-primary" />, time: new Date(), read: false },
  ]);
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('desktop-wallpaper') || 'gradient-to-br from-blue-600 via-blue-700 to-indigo-900');
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const saved = localStorage.getItem('icon-positions');
    return saved ? JSON.parse(saved) : {};
  });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean; type: 'desktop' | 'file' }>({ x: 0, y: 0, isOpen: false, type: 'desktop' });

  const handleWallpaperChange = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    localStorage.setItem('desktop-wallpaper', newWallpaper);
  };

  const handleIconPositionChange = (iconId: string, x: number, y: number) => {
    const newPositions = { ...iconPositions, [iconId]: { x, y } };
    setIconPositions(newPositions);
    localStorage.setItem('icon-positions', JSON.stringify(newPositions));
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      const centerX = window.innerWidth / 2 - 350;
      const centerY = window.innerHeight / 2 - 275;
      setTimeout(() => {
        openWindow({ id: 'portfolio', title: 'portfolio.pdf', icon: '📄', isMinimized: false, isMaximized: false, x: centerX, y: centerY, width: 700, height: 550, content: <PDFViewer /> });
        setIsLoaded(true);
      }, 500);
    }
  }, [isLoaded, openWindow]);

  const handleDesktopClick = () => {
    setIsStartMenuOpen(false);
    setIsControlPanelOpen(false);
    setIsSearchOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };

  const handleDesktopContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, isOpen: true, type: 'desktop' });
  }, []);

  const handleContextMenuAction = (action: string) => {
    switch (action) {
      case 'refresh': window.location.reload(); break;
      case 'personalize': setShowWallpaperPicker(true); break;
      case 'display': handleIconClick('settings'); break;
    }
  };

  const handleIconClick = (id: string) => {
    const centerX = window.innerWidth / 2 - 300;
    const centerY = window.innerHeight / 2 - 250;
    switch (id) {
      case 'file-explorer':
        openWindow({ id: 'file-explorer', title: 'File Explorer', icon: '📁', isMinimized: false, isMaximized: false, x: centerX, y: centerY, width: 700, height: 500, content: <FileExplorer /> });
        break;
      case 'settings':
        openWindow({ id: 'settings', title: 'Settings', icon: '⚙️', isMinimized: false, isMaximized: false, x: centerX, y: centerY, width: 600, height: 450, content: <ControlPanel /> });
        break;
      case 'github':
        openWindow({ id: 'github', title: 'GitHub', icon: '🐙', isMinimized: false, isMaximized: false, x: centerX - 50, y: centerY - 50, width: 800, height: 550, content: <BrowserApp url="https://github.com" title="GitHub" /> });
        break;
    }
  };

  const handleSleep = () => setIsLocked(true);
  const handleUnlock = () => setIsLocked(false);
  const clearNotifications = () => setNotifications([]);
  const dismissNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const getWallpaperClass = () => {
    if (wallpaper === 'black') return 'bg-black';
    if (wallpaper === 'white') return 'bg-white';
    return `bg-${wallpaper}`;
  };

  return (
    <>
      <LockScreen isLocked={isLocked} onUnlock={handleUnlock} />
      
      <div className="fixed inset-0 overflow-hidden select-none" onClick={handleDesktopClick} onContextMenu={handleDesktopContextMenu}>
        <div className={cn("absolute inset-0 transition-all duration-700", getWallpaperClass(), "dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950")}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-700 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {defaultDesktopIcons.map((icon, index) => (
            <div key={icon.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <DesktopIcon icon={icon.icon} label={icon.label} customIcon={icon.customIcon} onClick={() => handleIconClick(icon.id)} position={iconPositions[icon.id]} onPositionChange={(x, y) => handleIconPositionChange(icon.id, x, y)} isDraggable={true} />
            </div>
          ))}
        </div>

        {/* Weather Widget & Notification Bell */}
        <div className="absolute top-4 right-4 z-10 flex items-start gap-2">
          <button onClick={() => setShowNotifications(true)} className="relative p-2 glass rounded-lg hover:bg-white/20 transition-colors">
            <Bell className="w-5 h-5 text-white" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <WeatherWidget />
        </div>

        {windows.map(window => <Window key={window.id} window={window} />)}
        
        <ContextMenu x={contextMenu.x} y={contextMenu.y} isOpen={contextMenu.isOpen} onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))} type={contextMenu.type} onAction={handleContextMenuAction} />
        <WallpaperPicker isOpen={showWallpaperPicker} onClose={() => setShowWallpaperPicker(false)} currentWallpaper={wallpaper} onSelect={handleWallpaperChange} />
        <StartMenu onSleep={handleSleep} />
        <ControlPanelPopup />
        <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <Taskbar onSearchClick={() => setIsSearchOpen(true)} isSearchOpen={isSearchOpen} setSearchOpen={setIsSearchOpen} />
        
        <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} notifications={notifications} onClearAll={clearNotifications} onDismiss={dismissNotification} onLocationRequest={() => { setShowNotifications(false); setShowLocationDialog(true); }} />
        <LocationPermissionDialog isOpen={showLocationDialog} onAllow={() => setShowLocationDialog(false)} onDeny={() => setShowLocationDialog(false)} />
      </div>
    </>
  );
}
