import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Wifi, Battery, ChevronUp } from 'lucide-react';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export function LockScreen({ isLocked, onUnlock }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(' ', '');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const diff = startY - clientY;
    const progress = Math.min(Math.max(diff / 200, 0), 1);
    setDragProgress(progress);
    
    if (progress >= 0.8) {
      setIsUnlocking(true);
      setTimeout(() => {
        onUnlock();
        setDragProgress(0);
        setIsUnlocking(false);
      }, 300);
      setIsDragging(false);
    }
  }, [isDragging, startY, onUnlock]);

  const handleDragEnd = useCallback(() => {
    if (!isUnlocking) {
      setDragProgress(0);
    }
    setIsDragging(false);
  }, [isUnlocking]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientY);
  const handleMouseUp = () => handleDragEnd();

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientY);
  const handleTouchEnd = () => handleDragEnd();

  // Click to unlock for accessibility
  const handleClick = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
      setIsUnlocking(false);
    }, 400);
  };

  if (!isLocked) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[9999] cursor-pointer select-none overflow-hidden",
        isUnlocking && "animate-fade-out"
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Background with blur */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
        style={{
          transform: `scale(${1 + dragProgress * 0.05})`,
          filter: `blur(${dragProgress * 20}px)`,
          transition: isDragging ? 'none' : 'all 0.3s ease-out'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>
      </div>

      {/* Content overlay */}
      <div 
        className="relative h-full flex flex-col items-center justify-center text-white"
        style={{
          opacity: 1 - dragProgress * 0.5,
          transform: `translateY(${-dragProgress * 100}px)`,
          transition: isDragging ? 'none' : 'all 0.3s ease-out'
        }}
      >
        {/* Status bar */}
        <div className="absolute top-4 right-4 flex items-center gap-3 text-white/80">
          <Wifi className="w-4 h-4" />
          <div className="flex items-center gap-1">
            <Battery className="w-4 h-4" />
            <span className="text-xs">100%</span>
          </div>
        </div>

        {/* Time */}
        <div className="text-center mb-4">
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-light tracking-tight drop-shadow-lg">
            {formatTime(currentTime)}
          </h1>
        </div>

        {/* Date */}
        <p className="text-xl sm:text-2xl font-light text-white/90 drop-shadow mb-8">
          {formatDate(currentTime)}
        </p>

        {/* User avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 shadow-xl ring-4 ring-white/20">
          <span className="text-4xl sm:text-5xl">👤</span>
        </div>
        <p className="text-lg font-medium text-white/90 mb-2">Dilip Poudel</p>
        <p className="text-sm text-white/60 mb-12">Data Scientist</p>

        {/* Swipe hint */}
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <ChevronUp className="w-8 h-8 text-white/50" />
          <ChevronUp className="w-8 h-8 text-white/30 -mt-4" />
          <p className="text-sm text-white/50 mt-2">Swipe up or click to unlock</p>
        </div>

        {/* Progress indicator */}
        {dragProgress > 0 && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
          >
            <div 
              className="h-full bg-white transition-all"
              style={{ width: `${dragProgress * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
