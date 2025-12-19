import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, Home, Star, Clock, Download, Image, Music, Video, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDesktop } from '@/contexts/DesktopContext';
import { PDFViewer } from './PDFViewer';

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: React.ReactNode;
  children?: FolderItem[];
  description?: string;
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
        description: 'My professional portfolio'
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
];

const quickAccess = [
  { id: 'home', name: 'Home', icon: <Home className="w-4 h-4" /> },
  { id: 'favorites', name: 'Favorites', icon: <Star className="w-4 h-4" /> },
  { id: 'recent', name: 'Recent', icon: <Clock className="w-4 h-4" /> },
  { id: 'downloads', name: 'Downloads', icon: <Download className="w-4 h-4" /> },
];

export function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['documents']));
  const [selectedItem, setSelectedItem] = useState<string | null>('documents');
  const [currentPath, setCurrentPath] = useState(['This PC', 'Documents']);
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
    if (item.id === 'portfolio' && item.type === 'file') {
      const centerX = window.innerWidth / 2 - 350;
      const centerY = window.innerHeight / 2 - 275;
      
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
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 border-r border-border/50 p-2 overflow-y-auto hidden sm:block">
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
              onClick={() => setSelectedItem(item.id)}
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
      <div className="flex-1 flex flex-col">
        {/* Path Bar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 text-sm bg-secondary/20">
          {currentPath.map((segment, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <button className="hover:bg-secondary/50 px-2 py-1 rounded-lg transition-colors">
                {segment}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedFolder?.type === 'folder' && selectedFolder.children ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedFolder.children.map((item, index) => (
                <button
                  key={item.id}
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-secondary/50 group transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onDoubleClick={() => handleFileDoubleClick(item)}
                >
                  <div className="relative transition-transform duration-200 group-hover:scale-110">
                    {item.type === 'folder' ? (
                      <Folder className="w-14 h-14 text-yellow-500" />
                    ) : (
                      <FileText className="w-14 h-14 text-red-500" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center line-clamp-2 font-medium">{item.name}</span>
                  {item.description && (
                    <span className="text-[10px] text-muted-foreground mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {fileSystem.map((item, index) => (
                <button
                  key={item.id}
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-secondary/50 transition-all duration-200 group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    setSelectedItem(item.id);
                    if (item.type === 'folder') toggleFolder(item.id);
                  }}
                >
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon || <Folder className="w-14 h-14 text-yellow-500" />}
                  </div>
                  <span className="text-xs mt-2 text-center font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/50 text-xs text-muted-foreground bg-secondary/20">
          <span>{selectedFolder?.children?.length || fileSystem.length} items</span>
          <span>Windows 11 Style</span>
        </div>
      </div>
    </div>
  );
}