import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, Home, Star, Clock, Download, Image, Music, Video, FileText, Gamepad2, ArrowLeft, Menu, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDesktop } from '@/contexts/DesktopContext';
import { PDFViewer } from './PDFViewer';
import { PhotosApp } from './PhotosApp';
import { SnakeGame } from './SnakeGame';

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: React.ReactNode;
  children?: FolderItem[];
  description?: string;
  appType?: 'pdf' | 'photos' | 'snake' | 'pdf-ecommerce' | 'pdf-pandas';
}

const fileSystem: FolderItem[] = [
  {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    children: [
      { 
        id: 'portfolio', 
        name: 'portfolio.pdf', 
        type: 'file', 
        icon: <FileText className="w-4 h-4 text-red-500" />,
        description: 'My professional portfolio',
        appType: 'pdf'
      },
    ]
  },
  {
    id: 'notes',
    name: 'Notes',
    type: 'folder',
    icon: <StickyNote className="w-4 h-4 text-yellow-500" />,
    children: [
      { 
        id: 'ecommerce-analysis', 
        name: 'ecommerceanalysis.pdf', 
        type: 'file', 
        icon: <FileText className="w-4 h-4 text-red-500" />,
        description: 'E-commerce data analysis',
        appType: 'pdf-ecommerce'
      },
      { 
        id: 'pandas-importants', 
        name: 'pandasimportants.pdf', 
        type: 'file', 
        icon: <FileText className="w-4 h-4 text-red-500" />,
        description: 'Pandas important concepts',
        appType: 'pdf-pandas'
      },
    ]
  },
  {
    id: 'downloads',
    name: 'Downloads',
    type: 'folder',
  },
  {
    id: 'pictures',
    name: 'Pictures',
    type: 'folder',
    icon: <Image className="w-4 h-4 text-green-500" />,
    children: [
      { 
        id: 'photos-app', 
        name: 'Photos', 
        type: 'file', 
        icon: <Image className="w-4 h-4 text-green-500" />,
        description: 'View photos and videos',
        appType: 'photos'
      },
    ]
  },
  {
    id: 'music',
    name: 'Music',
    type: 'folder',
    icon: <Music className="w-4 h-4 text-pink-500" />,
  },
  {
    id: 'videos',
    name: 'Videos',
    type: 'folder',
    icon: <Video className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'games',
    name: 'Games',
    type: 'folder',
    icon: <Gamepad2 className="w-4 h-4 text-orange-500" />,
    children: [
      { 
        id: 'snake-game', 
        name: 'Snake', 
        type: 'file', 
        icon: <Gamepad2 className="w-4 h-4 text-orange-500" />,
        description: 'Classic snake game',
        appType: 'snake'
      },
    ]
  },
];

const quickAccess = [
  { id: 'home', name: 'Home', icon: <Home className="w-4 h-4" /> },
  { id: 'favorites', name: 'Favorites', icon: <Star className="w-4 h-4" /> },
  { id: 'recent', name: 'Recent', icon: <Clock className="w-4 h-4" /> },
  { id: 'downloads', name: 'Downloads', icon: <Download className="w-4 h-4" /> },
];

export function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['documents', 'pictures', 'games', 'notes']));
  const [selectedItem, setSelectedItem] = useState<string | null>('documents');
  const [currentPath, setCurrentPath] = useState<string[]>(['This PC']);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { openWindow } = useDesktop();

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFileDoubleClick = (item: FolderItem) => {
    const centerX = window.innerWidth / 2 - 350;
    const centerY = window.innerHeight / 2 - 275;
    
    if (item.appType === 'pdf') {
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
    } else if (item.appType === 'pdf-ecommerce') {
      openWindow({
        id: 'ecommerce-pdf',
        title: 'ecommerceanalysis.pdf',
        icon: '📄',
        isMinimized: false,
        isMaximized: false,
        x: centerX + 20,
        y: centerY + 20,
        width: 700,
        height: 550,
        content: <PDFViewer fileName="ecommerceanalysis.pdf" pdfType="ecommerce" />,
      });
    } else if (item.appType === 'pdf-pandas') {
      openWindow({
        id: 'pandas-pdf',
        title: 'pandasimportants.pdf',
        icon: '📄',
        isMinimized: false,
        isMaximized: false,
        x: centerX + 40,
        y: centerY + 40,
        width: 700,
        height: 550,
        content: <PDFViewer fileName="pandasimportants.pdf" pdfType="pandas" />,
      });
    } else if (item.appType === 'photos') {
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
    } else if (item.appType === 'snake') {
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
    }
  };

  const handleFolderClick = (item: FolderItem) => {
    if (item.type === 'folder') {
      setNavigationHistory(prev => [...prev, selectedItem || 'home']);
      setSelectedItem(item.id);
      setCurrentPath(prev => [...prev, item.name]);
      toggleFolder(item.id);
    }
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const previousItem = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setSelectedItem(previousItem);
      setCurrentPath(prev => prev.slice(0, -1));
    } else {
      setSelectedItem(null);
      setCurrentPath(['This PC']);
    }
  };

  const renderTreeItem = (item: FolderItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItem === item.id;
    const hasChildren = item.type === 'folder' && item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all duration-200",
            isSelected ? "bg-primary/15 text-primary" : "hover:bg-secondary/50"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            setSelectedItem(item.id);
            if (item.type === 'folder') {
              toggleFolder(item.id);
            }
          }}
          onDoubleClick={() => handleFileDoubleClick(item)}
        >
          {item.type === 'folder' && (
            <span className="w-4 h-4 flex items-center justify-center">
              {hasChildren && (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
            </span>
          )}
          {item.icon || (item.type === 'folder' ? <Folder className="w-4 h-4 text-yellow-500" /> : <FileText className="w-4 h-4" />)}
          <span className="truncate">{item.name}</span>
        </button>
        {hasChildren && isExpanded && (
          <div className="animate-fade-in">
            {item.children!.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getSelectedFolder = (): FolderItem | undefined => {
    const findItem = (items: FolderItem[]): FolderItem | undefined => {
      for (const item of items) {
        if (item.id === selectedItem) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
    };
    return findItem(fileSystem);
  };

  const selectedFolder = getSelectedFolder();

  return (
    <div className="flex h-full relative">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "w-48 border-r border-border/50 p-2 overflow-y-auto bg-background z-50 transition-transform duration-300",
        "fixed sm:relative inset-y-0 left-0 h-full sm:translate-x-0",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      )}>
        {/* Quick Access */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground px-2 py-1 font-medium">Quick access</p>
          {quickAccess.map(item => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all duration-200",
                selectedItem === item.id ? "bg-primary/15 text-primary" : "hover:bg-secondary/50"
              )}
              onClick={() => {
                setSelectedItem(item.id);
                setShowMobileSidebar(false);
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Tree View */}
        <div>
          <p className="text-xs text-muted-foreground px-2 py-1 font-medium">This PC</p>
          {fileSystem.map(item => renderTreeItem(item))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Path Bar with Navigation */}
        <div className="flex items-center gap-1 px-2 py-2 border-b border-border/50 text-sm bg-secondary/20">
          {/* Mobile menu button */}
          <button 
            className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors sm:hidden"
            onClick={() => setShowMobileSidebar(true)}
          >
            <Menu className="w-4 h-4" />
          </button>
          
          {/* Back button */}
          <button 
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              navigationHistory.length > 0 || selectedItem 
                ? "hover:bg-secondary/50" 
                : "opacity-50 cursor-not-allowed"
            )}
            onClick={handleGoBack}
            disabled={navigationHistory.length === 0 && !selectedItem}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 overflow-x-auto flex-1">
            {currentPath.map((segment, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                <button className="hover:bg-secondary/50 px-2 py-1 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm">
                  {segment}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          {selectedFolder?.type === 'folder' && selectedFolder.children ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {selectedFolder.children.map((item, index) => (
                <button
                  key={item.id}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-xl hover:bg-secondary/50 active:bg-secondary/70 group transition-all duration-200 animate-fade-in touch-manipulation"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    if (item.type === 'folder') {
                      handleFolderClick(item);
                    } else {
                      handleFileDoubleClick(item);
                    }
                  }}
                >
                  <div className="relative transition-transform duration-200 group-hover:scale-110">
                    {item.type === 'folder' ? (
                      <Folder className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-500" />
                    ) : item.icon ? (
                      <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
                        {React.cloneElement(item.icon as React.ReactElement, { className: 'w-8 h-8 sm:w-10 sm:h-10' })}
                      </div>
                    ) : (
                      <FileText className="w-10 h-10 sm:w-14 sm:h-14 text-red-500" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs mt-2 text-center line-clamp-2 font-medium">{item.name}</span>
                  {item.description && (
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                      {item.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {fileSystem.map((item, index) => (
                <button
                  key={item.id}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-xl hover:bg-secondary/50 active:bg-secondary/70 transition-all duration-200 group animate-fade-in touch-manipulation"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleFolderClick(item)}
                >
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon ? (
                      <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
                        {React.cloneElement(item.icon as React.ReactElement, { className: 'w-8 h-8 sm:w-10 sm:h-10' })}
                      </div>
                    ) : (
                      <Folder className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-500" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs mt-2 text-center font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/50 text-[10px] sm:text-xs text-muted-foreground bg-secondary/20">
          <span>{selectedFolder?.children?.length || fileSystem.length} items</span>
          <span className="hidden sm:inline">Windows 11 Style</span>
        </div>
      </div>
    </div>
  );
}
