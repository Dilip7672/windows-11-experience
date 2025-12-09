import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, Home, Star, Clock, Download, Image, Music, Video, FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: React.ReactNode;
  children?: FolderItem[];
  link?: string;
  description?: string;
}

const projects: FolderItem[] = [
  {
    id: 'projects',
    name: 'Projects',
    type: 'folder',
    children: [
      {
        id: 'portfolio',
        name: 'Portfolio Website',
        type: 'folder',
        children: [
          { id: 'p1', name: 'index.html', type: 'file', icon: <FileText className="w-4 h-4 text-orange-500" /> },
          { id: 'p2', name: 'styles.css', type: 'file', icon: <FileText className="w-4 h-4 text-blue-500" /> },
          { id: 'p3', name: 'app.js', type: 'file', icon: <FileText className="w-4 h-4 text-yellow-500" /> },
        ]
      },
      {
        id: 'ecommerce',
        name: 'E-Commerce App',
        type: 'folder',
        description: 'Full-stack shopping platform built with React & Node.js',
        children: [
          { id: 'e1', name: 'README.md', type: 'file' },
          { id: 'e2', name: 'package.json', type: 'file' },
        ]
      },
      {
        id: 'dashboard',
        name: 'Analytics Dashboard',
        type: 'folder',
        description: 'Real-time data visualization with D3.js',
        children: [
          { id: 'd1', name: 'App.tsx', type: 'file' },
          { id: 'd2', name: 'components/', type: 'folder' },
        ]
      },
      {
        id: 'chatbot',
        name: 'AI Chatbot',
        type: 'folder',
        description: 'GPT-powered conversational interface',
      },
      {
        id: 'weather',
        name: 'Weather App',
        type: 'folder',
        description: 'Beautiful weather forecasts with geolocation',
      },
    ]
  },
  {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    children: [
      { id: 'doc1', name: 'Resume.pdf', type: 'file', icon: <FileText className="w-4 h-4 text-red-500" /> },
      { id: 'doc2', name: 'Cover Letter.docx', type: 'file', icon: <FileText className="w-4 h-4 text-blue-500" /> },
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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['projects']));
  const [selectedItem, setSelectedItem] = useState<string | null>('projects');
  const [currentPath, setCurrentPath] = useState(['This PC', 'Projects']);

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

  const renderTreeItem = (item: FolderItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItem === item.id;
    const hasChildren = item.type === 'folder' && item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1 rounded text-sm hover-effect",
            isSelected && "bg-primary/10 text-primary"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            setSelectedItem(item.id);
            if (item.type === 'folder') {
              toggleFolder(item.id);
            }
          }}
        >
          {item.type === 'folder' && (
            <span className="w-4 h-4 flex items-center justify-center">
              {hasChildren && (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
            </span>
          )}
          {item.icon || (item.type === 'folder' ? <Folder className="w-4 h-4 text-yellow-500" /> : <File className="w-4 h-4" />)}
          <span className="truncate">{item.name}</span>
        </button>
        {hasChildren && isExpanded && (
          <div>
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
    return findItem(projects);
  };

  const selectedFolder = getSelectedFolder();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 border-r border-border/50 p-2 overflow-y-auto hidden sm:block">
        {/* Quick Access */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground px-2 py-1">Quick access</p>
          {quickAccess.map(item => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover-effect",
                selectedItem === item.id && "bg-primary/10 text-primary"
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
          <p className="text-xs text-muted-foreground px-2 py-1">This PC</p>
          {projects.map(item => renderTreeItem(item))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Path Bar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 text-sm">
          {currentPath.map((segment, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <button className="hover:bg-secondary/50 px-1.5 py-0.5 rounded">
                {segment}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedFolder?.type === 'folder' && selectedFolder.children ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedFolder.children.map(item => (
                <button
                  key={item.id}
                  className="flex flex-col items-center p-3 rounded-lg hover-effect group"
                  onDoubleClick={() => {
                    if (item.type === 'folder') {
                      setSelectedItem(item.id);
                      toggleFolder(item.id);
                    }
                  }}
                >
                  <div className="relative">
                    {item.type === 'folder' ? (
                      <Folder className="w-12 h-12 text-yellow-500" />
                    ) : (
                      item.icon || <File className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center line-clamp-2">{item.name}</span>
                  {item.description && (
                    <span className="text-[10px] text-muted-foreground mt-1 text-center line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {projects.map(item => (
                <button
                  key={item.id}
                  className="flex flex-col items-center p-3 rounded-lg hover-effect"
                  onClick={() => {
                    setSelectedItem(item.id);
                    if (item.type === 'folder') toggleFolder(item.id);
                  }}
                >
                  {item.icon || <Folder className="w-12 h-12 text-yellow-500" />}
                  <span className="text-xs mt-2 text-center">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-border/50 text-xs text-muted-foreground">
          <span>{selectedFolder?.children?.length || projects.length} items</span>
          <span>Windows 11 Style</span>
        </div>
      </div>
    </div>
  );
}
