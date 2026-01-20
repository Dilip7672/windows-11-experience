import React, { useState, useEffect } from 'react';
import { Bell, X, Trash2, MapPin, Wifi, Battery, Volume2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  time: Date;
  read: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onClearAll: () => void;
  onDismiss: (id: string) => void;
  onLocationRequest?: () => void;
}

export function NotificationCenter({ 
  isOpen, 
  onClose, 
  notifications, 
  onClearAll, 
  onDismiss,
  onLocationRequest 
}: NotificationCenterProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 z-[950]",
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        )}
        onClick={handleClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "fixed right-2 sm:right-4 top-2 bottom-14 w-[calc(100%-16px)] sm:w-[380px] max-w-[400px] glass rounded-xl overflow-hidden z-[951] window-shadow flex flex-col",
          isClosing ? "animate-fade-out" : "animate-fade-in"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-secondary/50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions - Mobile location request */}
        <div className="p-3 border-b border-border/50 bg-secondary/20">
          <p className="text-xs text-muted-foreground mb-2">Quick Settings</p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={onLocationRequest}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px]">Location</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[10px]">Wi-Fi</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Battery className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-[10px]">Battery</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-[10px]">Sound</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
              <Bell className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-lg hover:bg-secondary/50 transition-colors animate-list-item group relative",
                    !notification.read && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {formatTime(notification.time)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDismiss(notification.id)}
                    className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
