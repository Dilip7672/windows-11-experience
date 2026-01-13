import React, { useState, useEffect } from 'react';
import { Power, Moon, RotateCcw, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PowerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type PowerAction = 'sleep' | 'restart' | 'shutdown' | null;

export function PowerMenu({ isOpen, onClose }: PowerMenuProps) {
  const [selectedAction, setSelectedAction] = useState<PowerAction>(null);
  const [countdown, setCountdown] = useState(3);
  const [isPerforming, setIsPerforming] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedAction(null);
      setCountdown(3);
      setIsPerforming(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPerforming && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isPerforming && countdown === 0) {
      performAction();
    }
  }, [isPerforming, countdown]);

  const performAction = () => {
    switch (selectedAction) {
      case 'sleep':
        // Simulate sleep - darken screen
        document.body.style.transition = 'filter 1s ease';
        document.body.style.filter = 'brightness(0)';
        setTimeout(() => {
          document.body.style.filter = '';
          onClose();
        }, 3000);
        break;
      case 'restart':
        // Simulate restart - reload page
        window.location.reload();
        break;
      case 'shutdown':
        // Simulate shutdown - show black screen then reload
        document.body.style.transition = 'filter 1s ease';
        document.body.style.filter = 'brightness(0)';
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        break;
    }
  };

  const handleAction = (action: PowerAction) => {
    setSelectedAction(action);
    setIsPerforming(true);
  };

  const cancelAction = () => {
    setSelectedAction(null);
    setIsPerforming(false);
    setCountdown(3);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100] animate-fade-in" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] animate-window-open w-[95%] max-w-[350px]">
        <div className="glass rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/80">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Power Options</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {isPerforming ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  {selectedAction === 'sleep' && <Moon className="w-8 h-8 text-primary" />}
                  {selectedAction === 'restart' && <RotateCcw className="w-8 h-8 text-primary animate-spin" />}
                  {selectedAction === 'shutdown' && <Power className="w-8 h-8 text-destructive" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {selectedAction === 'sleep' && 'Going to sleep...'}
                  {selectedAction === 'restart' && 'Restarting...'}
                  {selectedAction === 'shutdown' && 'Shutting down...'}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {countdown > 0 ? `Starting in ${countdown} seconds` : 'Please wait...'}
                </p>
                <button
                  onClick={cancelAction}
                  className="px-4 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleAction('sleep')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-secondary/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Moon className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Sleep</span>
                </button>

                <button
                  onClick={() => handleAction('restart')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-secondary/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium">Restart</span>
                </button>

                <button
                  onClick={() => handleAction('shutdown')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-secondary/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Power className="w-6 h-6 text-destructive" />
                  </div>
                  <span className="text-sm font-medium">Shut down</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
