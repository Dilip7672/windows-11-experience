import React from 'react';
import { Check, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WallpaperPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper: string;
  onSelect: (wallpaper: string) => void;
}

const wallpapers = [
  {
    id: 'gradient-blue',
    name: 'Blue Gradient',
    value: 'gradient-to-br from-blue-600 via-blue-700 to-indigo-900',
    preview: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900'
  },
  {
    id: 'gradient-purple',
    name: 'Purple Dreams',
    value: 'gradient-to-br from-purple-600 via-violet-700 to-indigo-900',
    preview: 'bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-900'
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset',
    value: 'gradient-to-br from-orange-500 via-pink-600 to-purple-800',
    preview: 'bg-gradient-to-br from-orange-500 via-pink-600 to-purple-800'
  },
  {
    id: 'gradient-forest',
    name: 'Forest',
    value: 'gradient-to-br from-green-600 via-emerald-700 to-teal-900',
    preview: 'bg-gradient-to-br from-green-600 via-emerald-700 to-teal-900'
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean',
    value: 'gradient-to-br from-cyan-500 via-blue-600 to-indigo-800',
    preview: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800'
  },
  {
    id: 'gradient-rose',
    name: 'Rose',
    value: 'gradient-to-br from-rose-500 via-pink-600 to-fuchsia-800',
    preview: 'bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-800'
  },
  {
    id: 'gradient-dark',
    name: 'Dark',
    value: 'gradient-to-br from-slate-800 via-slate-900 to-black',
    preview: 'bg-gradient-to-br from-slate-800 via-slate-900 to-black'
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora',
    value: 'gradient-to-br from-emerald-500 via-cyan-600 to-blue-800',
    preview: 'bg-gradient-to-br from-emerald-500 via-cyan-600 to-blue-800'
  },
  {
    id: 'solid-black',
    name: 'Solid Black',
    value: 'black',
    preview: 'bg-black'
  },
  {
    id: 'solid-white',
    name: 'Solid White',
    value: 'white',
    preview: 'bg-white'
  },
];

export function WallpaperPicker({ isOpen, onClose, currentWallpaper, onSelect }: WallpaperPickerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100] animate-fade-in" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] animate-window-open w-[95%] max-w-[500px] max-h-[80vh]">
        <div className="glass rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/80">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Choose Wallpaper</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => {
                    onSelect(wallpaper.value);
                    onClose();
                  }}
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden transition-all group",
                    currentWallpaper === wallpaper.value ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:ring-2 hover:ring-primary/50"
                  )}
                >
                  <div className={cn("absolute inset-0", wallpaper.preview)} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">{wallpaper.name}</span>
                  </div>
                  {currentWallpaper === wallpaper.value && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
