import React, { useState, useEffect, useRef } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { FileExplorer } from './apps/FileExplorer';
import { ControlPanel } from './apps/ControlPanel';
import { BrowserApp } from './apps/BrowserApp';
import { PhotosApp } from './apps/PhotosApp';
import { SnakeGame } from './apps/SnakeGame';
import { NotepadApp } from './apps/NotepadApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { SystemInfo } from './apps/SystemInfo';
import { PowerMenu } from './PowerMenu';
import { UserProfile } from './UserProfile';
import { Power, User, Search, X, ChevronRight, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  category?: string;
}

interface StartMenuProps {
  onSleep?: () => void;
}

export function StartMenu({ onSleep }: StartMenuProps) {
  const { isStartMenuOpen, setIsStartMenuOpen, openWindow } = useDesktop();
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // All available apps
  const allApps: AppItem[] = [
    { id: 'file-explorer', name: 'File Explorer', icon: '📁', category: 'System' },
    { id: 'settings', name: 'Settings', icon: '⚙️', category: 'System' },
    { id: 'notepad', name: 'Notepad', icon: '📝', category: 'Productivity' },
    { id: 'calculator', name: 'Calculator', icon: '🔢', category: 'Utilities' },
    { id: 'photos', name: 'Photos', icon: '🖼️', category: 'Media' },
    { id: 'snake', name: 'Snake Game', icon: '🐍', category: 'Games' },
    { id: 'system-info', name: 'System Info', icon: '💻', category: 'System' },
    { id: 'github', name: 'GitHub', icon: '🐙', category: 'Web' },
    { id: 'facebook', name: 'Facebook', icon: '📘', category: 'Social' },
    { id: 'instagram', name: 'Instagram', icon: '📷', category: 'Social' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', category: 'Social' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', category: 'Media' },
    { id: 'spotify', name: 'Spotify', icon: '🎵', category: 'Media' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', category: 'Social' },
    { id: 'gmail', name: 'Gmail', icon: '📧', category: 'Productivity' },
    { id: 'google', name: 'Google', icon: '🔍', category: 'Web' },
    { id: 'maps', name: 'Maps', icon: '🗺️', category: 'Utilities' },
    { id: 'calendar', name: 'Calendar', icon: '📅', category: 'Productivity' },
    { id: 'weather', name: 'Weather', icon: '🌤️', category: 'Utilities' },
    { id: 'clock', name: 'Clock', icon: '⏰', category: 'Utilities' },
  ];

  const pinnedApps = allApps.slice(0, 12);

  // Filter apps based on search query
  const filteredApps = (showAllApps ? allApps : pinnedApps).filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group apps by category for all apps view
  const groupedApps = allApps.reduce((acc, app) => {
    const category = app.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(app);
    return acc;
  }, {} as Record<string, AppItem[]>);

  // Focus search input when menu opens
  useEffect(() => {
    if (isStartMenuOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    if (!isStartMenuOpen) {
      setSearchQuery('');
      setIsClosing(false);
      setShowAllApps(false);
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
      case 'notepad':
        openWindow({
          id: 'notepad',
          title: 'Notepad',
          icon: '📝',
          isMinimized: false,
          isMaximized: false,
          x: centerX + 20,
          y: centerY + 20,
          width: 600,
          height: 450,
          content: <NotepadApp />,
        });
        break;
      case 'calculator':
        openWindow({
          id: 'calculator',
          title: 'Calculator',
          icon: '🔢',
          isMinimized: false,
          isMaximized: false,
          x: centerX + 150,
          y: centerY + 50,
          width: 320,
          height: 450,
          content: <CalculatorApp />,
        });
        break;
      case 'photos':
        openWindow({
          id: 'photos',
          title: 'Photos',
          icon: '🖼️',
          isMinimized: false,
          isMaximized: false,
          x: centerX - 50,
          y: centerY - 50,
          width: 750,
          height: 550,
          content: <PhotosApp />,
        });
        break;
      case 'snake':
        openWindow({
          id: 'snake',
          title: 'Snake Game',
          icon: '🐍',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 400,
          height: 500,
          content: <SnakeGame />,
        });
        break;
      case 'system-info':
        openWindow({
          id: 'system-info',
          title: 'System Information',
          icon: '💻',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 550,
          height: 450,
          content: <SystemInfo />,
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
      case 'linkedin':
        openWindow({
          id: 'linkedin',
          title: 'LinkedIn',
          icon: '💼',
          isMinimized: false,
          isMaximized: false,
          x: centerX + 30,
          y: centerY + 30,
          width: 800,
          height: 550,
          content: <BrowserApp url="https://linkedin.com" title="LinkedIn" />,
        });
        break;
      case 'gmail':
        openWindow({
          id: 'gmail',
          title: 'Gmail',
          icon: '📧',
          isMinimized: false,
          isMaximized: false,
          x: centerX - 20,
          y: centerY - 20,
          width: 850,
          height: 550,
          content: <BrowserApp url="https://mail.google.com" title="Gmail" />,
        });
        break;
      case 'google':
        openWindow({
          id: 'google',
          title: 'Google',
          icon: '🔍',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 800,
          height: 550,
          content: <BrowserApp url="https://google.com" title="Google" />,
        });
        break;
      case 'maps':
        openWindow({
          id: 'maps',
          title: 'Maps',
          icon: '🗺️',
          isMinimized: false,
          isMaximized: false,
          x: centerX - 50,
          y: centerY - 50,
          width: 850,
          height: 550,
          content: <BrowserApp url="https://maps.google.com" title="Google Maps" />,
        });
        break;
      case 'calendar':
        openWindow({
          id: 'calendar',
          title: 'Calendar',
          icon: '📅',
          isMinimized: false,
          isMaximized: false,
          x: centerX + 40,
          y: centerY + 40,
          width: 700,
          height: 500,
          content: <BrowserApp url="https://calendar.google.com" title="Google Calendar" />,
        });
        break;
      case 'weather':
        openWindow({
          id: 'weather-app',
          title: 'Weather',
          icon: '🌤️',
          isMinimized: false,
          isMaximized: false,
          x: centerX,
          y: centerY,
          width: 600,
          height: 450,
          content: <BrowserApp url="https://weather.com" title="Weather" />,
        });
        break;
      case 'clock':
        openWindow({
          id: 'clock',
          title: 'Clock',
          icon: '⏰',
          isMinimized: false,
          isMaximized: false,
          x: centerX + 100,
          y: centerY + 50,
          width: 400,
          height: 400,
          content: <BrowserApp url="https://time.is" title="World Clock" />,
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

  // Render PowerMenu and UserProfile even when Start Menu is closed
  const renderDialogs = (
    <>
      {/* Power Menu */}
      <PowerMenu 
        isOpen={showPowerMenu} 
        onClose={() => setShowPowerMenu(false)}
        onSleep={onSleep}
      />

      {/* User Profile */}
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </>
  );

  if (!isStartMenuOpen && !isClosing) return renderDialogs;

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

        {/* All Apps View */}
        {showAllApps ? (
          <div className="px-4 py-2 max-h-[400px] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">All Apps</h3>
              <button 
                onClick={() => setShowAllApps(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Grid3X3 className="w-3 h-3" />
                Back to pinned
              </button>
            </div>
            
            {Object.entries(groupedApps).map(([category, apps]) => (
              <div key={category} className="mb-4">
                <h4 className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                  {category}
                </h4>
                <div className="space-y-1">
                  {apps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase())).map((app, index) => (
                    <button
                      key={app.id}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover-effect animate-list-item"
                      style={{ animationDelay: `${index * 30}ms` }}
                      onClick={() => handleAppClick(app)}
                    >
                      <span className="text-xl">{app.icon}</span>
                      <span className="text-sm">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Pinned Apps */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">
                  {searchQuery ? `Results for "${searchQuery}"` : 'Pinned'}
                </h3>
                {!searchQuery && (
                  <button 
                    onClick={() => setShowAllApps(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    All apps <ChevronRight className="w-3 h-3" />
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
          </>
        )}

        {/* Footer - hidden on mobile */}
        <div className="hidden sm:flex items-center justify-between p-4 mt-2 border-t border-border/50">
          <button 
            onClick={() => {
              handleClose();
              setTimeout(() => setShowUserProfile(true), 250);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover-effect transition-bounce"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-sm">👨‍💻</span>
            </div>
            <span className="text-sm font-medium">Dilip Poudel</span>
          </button>
          <button 
            onClick={() => {
              handleClose();
              setTimeout(() => setShowPowerMenu(true), 250);
            }}
            className="p-2 rounded-lg hover-effect hover:text-destructive transition-all duration-200"
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>

      {renderDialogs}
    </>
  );
}
