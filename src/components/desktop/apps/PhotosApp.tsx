import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Play, Pause, ChevronLeft, ChevronRight, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/contexts/SettingsContext';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
}

// Sample media items
const mediaItems: MediaItem[] = [
  { id: '1', name: 'Sunset Beach', type: 'image', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { id: '2', name: 'Mountain View', type: 'image', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200' },
  { id: '3', name: 'City Lights', type: 'image', src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200' },
  { id: '4', name: 'Forest Path', type: 'image', src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200' },
  { id: '5', name: 'Ocean Waves', type: 'image', src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200' },
  { id: '6', name: 'Sample Video', type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

export function PhotosApp() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { volume } = useSettings();

  const currentIndex = selectedMedia ? mediaItems.findIndex(m => m.id === selectedMedia.id) : -1;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedMedia(mediaItems[currentIndex - 1]);
      resetView();
    }
  };
  
  const handleNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      setSelectedMedia(mediaItems[currentIndex + 1]);
      resetView();
    }
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Apply system volume to video
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume, selectedMedia]);

  if (selectedMedia) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-border/50 bg-secondary/30">
          <button
            onClick={() => { setSelectedMedia(null); resetView(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            {selectedMedia.type === 'image' && (
              <>
                <button onClick={handleZoomOut} className="p-2 rounded-lg hover:bg-secondary/50" title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-muted-foreground min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={handleZoomIn} className="p-2 rounded-lg hover:bg-secondary/50" title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={handleRotate} className="p-2 rounded-lg hover:bg-secondary/50" title="Rotate">
                  <RotateCw className="w-4 h-4" />
                </button>
              </>
            )}
            {selectedMedia.type === 'video' && (
              <>
                <button onClick={togglePlayPause} className="p-2 rounded-lg hover:bg-secondary/50">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-lg hover:bg-secondary/50">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
          
          <span className="text-sm text-muted-foreground">{selectedMedia.name}</span>
        </div>
        
        {/* Media View */}
        <div className="flex-1 flex items-center justify-center bg-black/90 relative overflow-hidden">
          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {currentIndex < mediaItems.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
          
          {selectedMedia.type === 'image' ? (
            <img
              src={selectedMedia.src}
              alt={selectedMedia.name}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
              draggable={false}
            />
          ) : (
            <video
              ref={videoRef}
              src={selectedMedia.src}
              className="max-w-full max-h-full"
              controls
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </div>
        
        {/* Thumbnail strip */}
        <div className="flex items-center gap-2 p-2 overflow-x-auto bg-secondary/30">
          {mediaItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => { setSelectedMedia(item); resetView(); }}
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                selectedMedia.id === item.id ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {item.type === 'image' ? (
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-lg font-semibold">Photos</h2>
        <p className="text-sm text-muted-foreground">View your photos and videos</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {mediaItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="relative aspect-square rounded-lg overflow-hidden group animate-fade-in hover:ring-2 ring-primary transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.type === 'image' ? (
                <img 
                  src={item.src} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Play className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white bg-black/50 px-1 py-0.5 rounded truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
